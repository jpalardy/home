
TARGET = public/js/app.js
ELM_FILES = $(wildcard src/*.elm)

$(TARGET): $(ELM_FILES)
	node_modules/.bin/elm make $(OPTIMIZE) src/Main.elm --output $@

optimize:
	@OPTIMIZE=--optimize make $(TARGET)

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -rf $(TARGET) elm-stuff

public/heisig.min.json: public/heisig.json
	jq '[.[] | {(.kanji): .keyword}] | add' -c $< > $@

