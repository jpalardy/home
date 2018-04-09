
build: clean
	@npm run build

watch:
	@npm run watch

coverage:
	@npm run coverage

test:
	@npm test

clean:
	rm -f public/app.*
	rm -f deploy.retry
	rm -rf coverage/ .nyc_output/

.PHONY: build watch coverage test clean

#-------------------------------------------------

deploy:
	ansible-playbook deploy.yml

