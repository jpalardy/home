
TARGET = public/js/volume.js
ELM_FILES = $(wildcard src/*.elm)

$(TARGET): node_modules $(ELM_FILES)
	node_modules/.bin/elm make $(OPTIMIZE) src/Volume.elm --output $@

node_modules:
	npm install

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -rf $(TARGET) elm-stuff

purge: clean
	rm -rf node_modules/

