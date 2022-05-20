MAKEFLAGS += --jobs=4

all: build

dev: 
	npx parcel -p 6001 'src/*/index.html'

build: 
	npx parcel build --dist-dir ./dist 'src/*/index.html'