package main

// typedef void (*callback_func) (char* err, char* value);
import "C"
import (
	"unsafe"

	"atulr.com/bigtable_server/internal"
)

//export GetProjects
func GetProjects(cb unsafe.Pointer) {
	internal.GetProjects2(cb)
}

func main() {

}
