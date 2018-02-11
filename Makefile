
webpack:
	@npx webpack --progress $(FLAGS)
	@rm public/out.css # damn webpack doesn't cleanup

webpack-p:
	@$(MAKE) FLAGS=-p

webpack-w:
	@$(MAKE) FLAGS=-w

run-local:
	cd public; browser-sync start --server --files .

test:
	@npx mocha --reporter dot

test-monitor:
	@nodemon -x "make test"

clean:
	rm deploy.retry

.PHONY: test

#-------------------------------------------------

deploy:
	ansible-playbook deploy.yml

