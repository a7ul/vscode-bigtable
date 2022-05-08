all: server lib

server:
	go build -o ./dist/server ./cmd/server.go

lib:
	go build -buildmode=c-shared -o ./dist/libserver.dylib  ./pkg/lib.go
