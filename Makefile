
build: clean public
	@npm run build
	sed -e "s/\$$VERSION/`git rev-parse --short HEAD` @ `date +%F`/" -i public/index.html

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
	aws s3 sync public/ s3://home.jpalardy.com/ --delete

