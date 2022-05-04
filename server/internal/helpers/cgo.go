package helpers

// #include <stdlib.h>
// typedef void (*callback_func) (char* err, char* value);
//
// void bridge_callback_func(callback_func f, char* err, char* value){
//   f(err, value);
// }
//
import "C"
import (
	"encoding/json"
	"unsafe"
)

func ExecutePointerCallback(cb unsafe.Pointer, value any, err error) {
	f := C.callback_func(cb)
	if err != nil {
		csErrorText := C.CString(err.Error())
		defer C.free(unsafe.Pointer(csErrorText))
		C.bridge_callback_func(f, csErrorText, nil)
	} else {
		value, err := json.Marshal(value)
		if err != nil {
			csErrorText := C.CString(err.Error())
			defer C.free(unsafe.Pointer(csErrorText))
			C.bridge_callback_func(f, csErrorText, nil)
		} else {
			csValueText := C.CString(string(value))
			defer C.free(unsafe.Pointer(csValueText))
			C.bridge_callback_func(f, nil, csValueText)
		}
	}
}

type Callback func(value any, err error)

func ToCallback(cb unsafe.Pointer) Callback {
	return func(value any, err error) {
		ExecutePointerCallback(cb, value, err)
	}
}

func CreateParser[T any](cb unsafe.Pointer, rawParams string, parsedParams T) func(onParse func(params T, callback Callback)) {
	return func(onParse func(params T, callback Callback)) {
		callback := ToCallback(cb)
		err := json.Unmarshal([]byte(rawParams), &parsedParams)
		if err != nil {
			callback(nil, err)
		} else {
			go func(parsedParams T, callback Callback) {
				onParse(parsedParams, callback)
			}(parsedParams, callback)
		}
	}
}
