MAKEFLAGS += --jobs=4

all: build

dev: 
	cd views && npx parcel -p 6001 index.html

build: 
	cd views && npx parcel build --dist-dir ../resources index.html

	