
TARGET = public/js/app.js
ELM_FILES = $(wildcard src/*.elm)

$(TARGET): node_modules $(ELM_FILES)
	npm exec -- elm make $(OPTIMIZE) src/Main.elm --output $@

node_modules:
	npm install

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -rf $(TARGET) elm-stuff

purge: clean
	rm -rf node_modules/

public/heisig.min.json: public/heisig.json
	jq '[.[] | {(.kanji): .keyword}] | add' -c $< > $@

