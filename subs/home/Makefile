
all: public/index.html public/aliases.txt

public:
	mkdir public

node_modules:
	npm install

.PHONY: compile
compile: node_modules
	npx tsc

public/app.js: public compile
	rm -rf public/app.*.js
	npx esbuild --bundle --minify dist/app.js --outfile=$@

public/index.html: COMMIT_SHA = $(shell git rev-parse --short HEAD)
public/index.html: TODAY = $(shell date +%F)
public/index.html: CHECKSUM = $(shell sha1sum $< | cut -c 1-7)
public/index.html: public/app.js
	ln -s app.js public/app.$(CHECKSUM).js
	m4 -D __VERSION__="$(COMMIT_SHA) @ $(TODAY)" -D __APPJS__=app.$(CHECKSUM).js src/html/index.html > $@

.PHONY: list
list:
	@node scripts/list-all.js | sort | column -t

public/aliases.txt: public/app.js
	make list > $@

# -------------------------------------------------

.PHONY: sane
sane: coverage lint

.PHONY: coverage
coverage: node_modules
	@npm run coverage
	npx type-coverage --detail

.PHONY: test
test: node_modules
	@npm test
	@awk '/alias:/' dist/*.js | awk -F'"' '/"/ {print $$2}' | sort | uniq -c | awk '$$1 != 1 { print "*********", $$0; exit 1 }'

.PHONY: lint
lint: node_modules
	npx eslint src/ts/ test/
	npx prettier src/ts/ test/ --check

# -------------------------------------------------

.PHONY: clean
clean:
	rm -rf public
	rm -rf coverage/ .nyc_output/
	rm -rf dist

purge: clean
	rm -rf node_modules/

