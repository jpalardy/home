
build: clean public
	@npm run build

public:
	mkdir -p public
	for sub in subs/*; do rsync -q -avz --delete $$sub/public/ public/`basename $$sub`/; done

watch:
	@npm run watch

coverage:
	@npm run coverage

test:
	@npm test

clean:
	rm -rf public
	rm -f deploy.retry
	rm -rf coverage/ .nyc_output/

.PHONY: build watch coverage test clean public

#-------------------------------------------------

deploy:
	rsync -avz public/ atlas@jpalardy.com:/home/atlas/home/public/ --delete

