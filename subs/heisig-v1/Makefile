
ELM_FILES = $(wildcard src/*.elm)

public/js/app.js: $(ELM_FILES)
	elm make $(OPTIMIZE) src/Main.elm --output $@

optimize:
	@OPTIMIZE=--optimize make public/js/app.js

watch:
	ls $(ELM_FILES) | entr -s 'make; ding'

clean:
	rm -f public/js/app.js

public/heisig.min.json: public/heisig.json
	jq '[.[] | {(.kanji): .keyword}] | add' -c $< > $@

