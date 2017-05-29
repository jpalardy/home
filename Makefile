
BIN = node_modules/.bin

DEPS_JS   = src/js/*.js
DEPS_CSS  = src/less/main.less
DEPS_HTML = src/jade/index.jade

tmp/%:
	mkdir -p $@

#-------------------------------------------------

all: js css html

js: tmp/js/app.js
tmp/js/app.js: $(DEPS_JS) tmp/js
	$(BIN)/browserify src/js/app.js | $(BIN)/uglifyjs > $@

css: tmp/css/main.css
tmp/css/main.css: $(DEPS_CSS) tmp/css
	$(BIN)/lessc $< $@

html: public/index.html js css
public/index.html: $(DEPS_HTML) $(DEPS_CSS) $(DEPS_JS) tmp/html
	cp src/jade/index.jade tmp
	node_modules/.bin/jade --pretty tmp/index.jade -o public

test:
	$(BIN)/mocha --reporter dot

clean:
	rm -r tmp

.PHONY: test

#-------------------------------------------------

deploy:
	ansible-playbook deploy.yml

