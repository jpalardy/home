
TARGET = public/js/volume.js
ELM_FILES = $(wildcard src/*.elm)

$(TARGET): $(ELM_FILES)
	node_modules/.bin/elm make src/Volume.elm --output $@

optimize:
	@OPTIMIZE=--optimize make $(TARGET)

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -rf $(TARGET) elm-stuff

