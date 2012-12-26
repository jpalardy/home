
COFFEEs = $(wildcard src/coffee/*.coffee)
JSs     = $(patsubst src/coffee/%.coffee,lib/%.js,$(COFFEEs))

lib/%.js: src/coffee/%.coffee
	coffee -c -o $(@D) $<

all: public/js/app.js

public/js/app.js: $(JSs)
	cat lib/models.js lib/views.js lib/app.js > $@

clean:
	rm -rf lib

