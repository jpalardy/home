BUNDLE = ./node_modules/.bin/esbuild --bundle --minify src/js/app.js

.PHONY: build
build: COMMIT_SHA = $(shell git rev-parse --short HEAD)
build: TODAY = $(shell date +%F)
build: CHECKSUM = $(shell $(BUNDLE) | sha1sum | cut -c 1-7)
build:
	test -d public || mkdir public
	for sub in subs/*/Makefile; do (cd `dirname $$sub`; make -B); done
	for sub in subs/*; do rsync -q -av --delete $$sub/public/ public/`basename $$sub`/; done
	rm -rf public/app*.js
	$(BUNDLE) --outfile=public/app.$(CHECKSUM).js
	m4 -D __VERSION__="$(COMMIT_SHA) @ $(TODAY)" -D __APPJS__=app.$(CHECKSUM).js src/html/index.html > public/index.html

watch:
	rg --files | entr make

.PHONY: coverage
coverage:
	@npm run coverage

.PHONY: test
test:
	@npm test
	@awk '/alias:/' src/js/*.js | awk -F'"' '/"/ {print $$2}' | sort | uniq -c | awk '$$1 != 1 { print "*********", $$0; exit 1 }'

.PHONY: clean
clean:
	rm -rf public
	rm -f deploy.retry
	rm -rf coverage/ .nyc_output/

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

