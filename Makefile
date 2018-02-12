
build:
	@npx parcel build src/html/index.html -d public --public-url ./ --no-minify --no-cache

watch:
	@npx parcel serve src/html/index.html -d public --no-source-maps

coverage: test
	@npx nyc mocha --reporter dot
	@npx nyc report --reporter=html

test:
	@npx mocha --reporter dot

test-monitor:
	@nodemon -x "npx mocha --reporter dot"

clean:
	rm deploy.retry

.PHONY: test

#-------------------------------------------------

deploy:
	ansible-playbook deploy.yml

