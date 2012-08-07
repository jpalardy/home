
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

js: $(DST_JS)

css: tmp/css/main.css
tmp/css/main.css: src/less/main.less tmp/css
	$(BIN_LESS) $< > $@

images: tmp/images/logo.jpg
tmp/images/logo.jpg: src/images/logo.jpg tmp/images
	cp $< $@

html: tmp/index.html
tmp/index.html: tmp/js/sites.js tmp
	coffee tools/extract_sites.coffee > src/html/sites.part
	sed '/id="cheatSheet"/ r src/html/sites.part' src/html/index.html > $@

clean:
	rm -rf tmp

spec: $(DST_JS)
	$(BIN_JASMINE) --coffee spec

inline:
	$(BIN_INLINER) --nocompress --verbose http://localhost:8000/index.html > public/index.html

