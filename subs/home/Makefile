
ELMs = $(wildcard **/*.elm)
OUTPUT = public/app.js
# --debug, probably
FLAGS ?= ""

# -------------------------------------------------

release: COMMIT_SHA = $(shell git rev-parse --short HEAD)
release: TODAY = $(shell date +%F)
release: optimize
	m4 -D __VERSION__="$(COMMIT_SHA) @ $(TODAY)" templates/index.html > public/index.html

.PHONY: optimize
optimize: node_modules test
	npm exec -- elm make src/Main.elm --optimize --output $(OUTPUT)
	npm exec -- uglifyjs $(OUTPUT) --compress 'pure_funcs=[F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9],pure_getters,keep_fargs=false,unsafe_comps,unsafe' | npm exec -- uglifyjs --mangle --output $(OUTPUT)

.PHONY: build
build: node_modules
	npm exec -- elm make src/Main.elm --output $(FLAGS) $(OUTPUT)

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
	rm -rf node_modules/ public

# -------------------------------------------------

node_modules:
	npm install

tests/Sites.elm: public/sites.json node_modules
	printf "module Sites exposing (all)\nimport Site exposing (Site)\nall : List Site\nall=" > $@
	sed -E -e 's/"([^"]+)":/\1 =/' $< >> $@
	npm exec -- elm-format --yes $@
	sleep 0.1

public/sites.json: $(wildcard sites/*.json)
	-mkdir public
	jq '.[]' sites/*.json | jq -s . > $@

