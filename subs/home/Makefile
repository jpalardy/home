
ELMs = $(wildcard **/*.elm)
OUTPUT = public/js/app.js

# -------------------------------------------------

.PHONY: optimize
optimize: test
	npm exec -- elm make src/Main.elm --optimize --output $(OUTPUT)
	npm exec -- uglifyjs $(OUTPUT) --compress 'pure_funcs=[F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9],pure_getters,keep_fargs=false,unsafe_comps,unsafe' | npm exec -- uglifyjs --mangle --output $(OUTPUT)

.PHONY: build
build:
	npm exec -- elm make src/Main.elm --output $(OUTPUT)

.PHONY: watch
watch:
	ls $(ELMs) | entr -c -s 'ding make -s build test'

.PHONY: test
test: tests/Sites.elm
	npm exec -- elm-test

.PHONY: clean
clean:
	rm -rf elm-stuff/ $(OUTPUT)

.PHONY: purge
purge: clean
	rm -rf node_modules/

# -------------------------------------------------

tests/Sites.elm: public/sites.json
	printf "module Sites exposing (all)\nimport Site exposing (Site)\nall : List Site\nall=" > $@
	sed -E -e 's/"([^"]+)":/\1 =/' $< >> $@
	npm exec -- elm-format --yes $@
	sleep 0.1

public/sites.json: $(wildcard sites/*.json)
	jq '.[]' sites/*.json | jq -s . > $@

