
BIN_MOCHA   = node_modules/.bin/mocha
BIN_LESS    = node_modules/.bin/lessc
BIN_INLINER = node_modules/.bin/inliner

tmp/%:
	mkdir -p $@

#-------------------------------------------------

all: js css html images

js: tmp/js tmp/js/sites.js
	cp src/js/* tmp/js

tmp/js/command.js: src/js/command.js
	cp $< $@

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

test:
	$(BIN_MOCHA) --reporter dot

inline:
	$(BIN_INLINER) --nocompress --verbose http://localhost:8000/index.html > public/index.html

.PHONY: test

