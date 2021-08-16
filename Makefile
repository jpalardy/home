
.PHONY: build
build: COMMIT_SHA = $(shell git rev-parse --short HEAD)
build: TODAY = $(shell date +%F)
build: MD5 = $(shell md5 -q src/js/app.js)
build:
	test -d public || mkdir public
	for sub in subs/*; do rsync -q -av --delete $$sub/public/ public/`basename $$sub`/; done
	rm -rf public/app*.js
	./node_modules/.bin/esbuild --bundle --minify src/js/app.js --outfile=public/app.$(MD5).js
	m4 -D __VERSION__="$(COMMIT_SHA) @ $(TODAY)" -D __MD5__=$(MD5) src/html/index.html > public/index.html

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

