
webpack:
	@npx webpack --progress $(FLAGS)
	@rm public/bundle.js public/out.css # damn webpack doesn't cleanup

webpack-p:
	@$(MAKE) FLAGS=-p

webpack-w:
	@$(MAKE) FLAGS=-w

test:
	@npx mocha --reporter dot

clean:
	rm deploy.retry

.PHONY: test

#-------------------------------------------------

deploy:
	ansible-playbook deploy.yml

