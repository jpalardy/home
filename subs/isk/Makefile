
.PHONY: build
build: compile
	rsync -a dist/isk.js public/js/

node_modules:
	npm install

.PHONY: compile
compile: node_modules
	npm exec -- tsc

.PHONY: watch
watch:
	npm exec -- tsc --watch

# -------------------------------------------------

.PHONY: clean
clean:
	rm -rf dist

purge: clean
	rm -rf node_modules/

