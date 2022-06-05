
.PHONY: build
build: compile
	cp dist/isk.js public/js/isk.js

.PHONY: compile
compile:
	npx tsc

.PHONY: watch
watch:
	npx tsc --watch

.PHONY: clean
clean:
	rm -rf dist/

