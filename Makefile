
BIN = node_modules/.bin

tmp/%:
	mkdir -p $@

#-------------------------------------------------

all: js css html

js: tmp/js/app.js
tmp/js/app.js: src/js/*.js tmp/js
	$(BIN)/browserify src/js/app.js | $(BIN)/uglifyjs > $@

css: tmp/css/main.css
tmp/css/main.css: src/less/main.less tmp/css
	$(BIN)/lessc $< $@

html: public/index.html js css
public/index.html: src/jade/index.jade tmp/html
	cp src/jade/index.jade tmp
	node_modules/.bin/jade --pretty tmp/index.jade -o public

test:
	$(BIN)/mocha --reporter dot

clean:
	rm -r tmp

.PHONY: test

