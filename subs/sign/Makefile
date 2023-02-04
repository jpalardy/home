
TARGET = public/js/app.js
ELM_FILES = $(wildcard src/*.elm)

public/js/app.js: check
$(TARGET): $(ELM_FILES)
	node_modules/.bin/elm make $(OPTIMIZE) src/Main.elm --output $@

optimize:
	@OPTIMIZE=--optimize make $(TARGET)

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -rf $(TARGET) elm-stuff

check:
	jq 'to_entries[].value' public/phrases.json | sort | uniq -c | awk '$$1 > 1 { print; exit 1 }'

