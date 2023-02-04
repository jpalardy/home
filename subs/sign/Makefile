
TARGET = public/js/app.js
ELM_FILES = $(wildcard src/*.elm)

$(TARGET): check
$(TARGET): node_modules $(ELM_FILES)
	node_modules/.bin/elm make $(OPTIMIZE) src/Main.elm --output $@

node_modules:
	npm install

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -rf $(TARGET) elm-stuff

purge: clean
	rm -rf node_modules/

check:
	jq 'to_entries[].value' public/phrases.json | sort | uniq -c | awk '$$1 > 1 { print; exit 1 }'

