
public/js/heisig.min.js: public/js/heisig.js
	node_modules/.bin/uglifyjs $< -o $@

public/js/heisig.js: src/js/app.js src/js/components.js src/js/starific.js
	node_modules/.bin/browserify $< -o $@

public/heisig.min.json: public/heisig.json
	cat $< | jq '[.[] | {(.kanji): (.keyword)}]' -c > $@

