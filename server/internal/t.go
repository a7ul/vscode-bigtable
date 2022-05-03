package internal

// #include <stdio.h>
// typedef void (*callback_func) (char* err, char* value);
//
// void bridge_callback_func(callback_func f, char* err, char* value){
//   f(err, value);
// }
//
import "C"
import (
	"fmt"
	"unsafe"
)

func GetProjects2(cb unsafe.Pointer) {
	f := C.callback_func(cb)
	fmt.Println(C.bridge_callback_func(f, nil, C.CString("yolo")))
}
