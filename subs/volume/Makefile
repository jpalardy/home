
ELM_FILES = $(wildcard src/*.elm)

public/js/volume.js: $(ELM_FILES)
	elm make src/Volume.elm --output $@

watch:
	ls $(ELM_FILES) | entr -s 'clear; make; ding'

clean:
	rm -f public/js/volume.js

