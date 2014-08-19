
BIN_COFFEE  = node_modules/.bin/coffee
BIN_JASMINE = node_modules/.bin/jasmine-node
BIN_LESS    = node_modules/.bin/lessc
BIN_INLINER = node_modules/.bin/inliner

SRC_COFFEE = $(shell find src/coffee -name '*.coffee')
DST_JS     = $(patsubst src/coffee/%.coffee, tmp/js/%.js, $(SRC_COFFEE))

tmp/js/%.js: src/coffee/%.coffee
	$(BIN_COFFEE) -c -o $(@D) $<

tmp/%:
	mkdir -p $@

#-------------------------------------------------

all: js css html images

js: $(DST_JS) tmp/js/sites.js

tmp/js/sites.js: config/sites.json
	awk 'BEGIN {printf "var sites = " } { print }' $< > $@

css: tmp/css/main.css
tmp/css/main.css: src/less/main.less tmp/css
	$(BIN_LESS) $< $@

images: tmp/images
	cp src/images/* tmp/images/

html: tmp/index.html
tmp/index.html: src/html/index.html config/sites.json tmp
	cat config/sites.json | jq '.[] | select(.hide != true) | "\(.alias)\t\(.name)"' -r > src/html/sites.part
	sed '/id="cheatSheet"/ r src/html/sites.part' src/html/index.html > $@

clean:
	rm -rf tmp

spec: $(DST_JS)
	$(BIN_JASMINE) --coffee spec

inline:
	$(BIN_INLINER) --nocompress --verbose http://localhost:8000/index.html > public/index.html

