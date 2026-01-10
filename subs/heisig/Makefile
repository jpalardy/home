
ELMs = $(wildcard **/*.elm)
OUTPUT = public/js/app.js

# -------------------------------------------------

.PHONY: optimize
optimize: node_modules test review tailwind-build
	npm exec -- elm make src/Main.elm --optimize --output $(OUTPUT)
	npm exec -- uglifyjs $(OUTPUT) --compress 'pure_funcs=[F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9],pure_getters,keep_fargs=false,unsafe_comps,unsafe' | npm exec -- uglifyjs --mangle --output $(OUTPUT)

.PHONY: build
build: node_modules
	npm exec -- elm make --debug src/Main.elm --output $(OUTPUT)

node_modules:
	npm install

.PHONY: watch
watch:
	ls $(ELMs) | entr -c -s 'ding make -s build'

.PHONY: test
test: node_modules
	npm exec -- elm-test

.PHONY: review
review: node_modules
	npm exec -- elm-review

.PHONY: clean
clean:
	rm -rf elm-stuff/ $(OUTPUT)

.PHONY: purge
purge: clean
	rm -rf node_modules/

# -------------------------------------------------

public/heisig.min.json: public/heisig.json
	jq '[.[] | {(.kanji): .keyword}] | add' -c $< > $@

tailwind:
	npm exec -- tailwindcss -i css/main.css -o public/css/main.css --minify --watch

tailwind-build:
	npm exec -- tailwindcss -i css/main.css -o public/css/main.css --minify

