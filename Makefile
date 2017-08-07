
webpack:
	@npx webpack
	@rm public/bundle.js public/out.css # damn webpack doesn't cleanup

webpack-p:
	@npx webpack -p
	@rm public/bundle.js public/out.css # damn webpack doesn't cleanup

test:
	@npx mocha --reporter dot

clean:
	rm deploy.retry

.PHONY: test

#-------------------------------------------------

deploy:
	ansible-playbook deploy.yml

