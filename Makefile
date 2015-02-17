
BIN_MOCHA   = node_modules/.bin/mocha
BIN_LESS    = node_modules/.bin/lessc

#-------------------------------------------------

all: js css html images

js: public/js/sites.js
	cp src/js/* public/js

public/js/sites.js: config/sites.json
	awk 'BEGIN {printf "var sites = " } { print }' $< > $@

css: public/css/main.css
public/css/main.css: src/less/main.less public/css
	$(BIN_LESS) $< $@

images: public/images
	cp src/images/* public/images/

html: public/index.html
public/index.html: src/html/index.html config/sites.json public
	cat config/sites.json | jq '.[] | select(.hide != true) | "\(.alias)\t\(.name)"' -r > src/html/sites.part
	sed '/id="cheatSheet"/ r src/html/sites.part' src/html/index.html > $@

test:
	$(BIN_MOCHA) --reporter dot

.PHONY: test

