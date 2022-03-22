
all: public/index.html subs

public:
	mkdir public

.PHONY: compile
compile:
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

.PHONY: subs
subs: public
	for sub in subs/*/Makefile; do (cd `dirname $$sub`; make -B); done
	for sub in subs/*; do rsync -q -av --delete $$sub/public/ public/`basename $$sub`/; done

# -------------------------------------------------

.PHONY: coverage
coverage:
	@npm run coverage

.PHONY: test
test: compile
	@npm test
	@awk '/alias:/' dist/*.js | awk -F'"' '/"/ {print $$2}' | sort | uniq -c | awk '$$1 != 1 { print "*********", $$0; exit 1 }'

.PHONY: lint
lint:
	npx eslint src/ts/

.PHONY: clean
clean:
	rm -rf public
	rm -f deploy.retry
	rm -rf coverage/ .nyc_output/
	rm -rf dist

#-------------------------------------------------

.PHONY: list
list:
	@node scripts/list-all.js | sort | column -t

#-------------------------------------------------

.PHONY: deploy-dryrun
deploy-dryrun:
	aws s3 sync public/ s3://home.jpalardy.com/ --delete --profile jonathan --dryrun

.PHONY: deploy
deploy:
	aws s3 sync public/ s3://home.jpalardy.com/ --profile jonathan
	aws cloudfront create-invalidation --distribution-id E1SGJ2SOI6A0WB --paths "/*" --profile jonathan

