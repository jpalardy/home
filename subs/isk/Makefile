
.PHONY: build
build: compile
	cp dist/isk.js public/js/isk.js

node_modules:
	npm install

.PHONY: compile
compile: node_modules
	npx tsc

.PHONY: watch
watch:
	npx tsc --watch

# -------------------------------------------------

.PHONY: clean
clean:
	rm -rf dist

purge: clean
	rm -rf node_modules/

