
BIN = node_modules/.bin

#-------------------------------------------------

all: js css html

js: public/js/app.js
public/js/app.js: src/js/*.js
	$(BIN)/browserify src/js/app.js | $(BIN)/uglifyjs > public/js/app.js

css: public/css/main.css
public/css/main.css: src/less/main.less public/css
	$(BIN)/lessc $< $@

html: public/index.html
public/index.html: src/html/index.html src/js/sites.js
	cat src/js/sites.js | sed -e 's/module.exports =//' -e 's/];/]/' | jq '.[] | select(.hide != true) | "\(.alias)\t\(.name)"' -r > src/html/sites.part
	sed '/id="cheatSheet"/ r src/html/sites.part' src/html/index.html > $@

test:
	$(BIN)/mocha --reporter dot

.PHONY: test

