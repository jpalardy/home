
public/js/heisig.min.js: public/js/heisig.js
	node_modules/.bin/uglifyjs $< -o $@

public/js/heisig.js:
	node_modules/.bin/browserify src/js/app.js > $@

public/heisig.min.json: public/heisig.json
	cat $< | jq '[.[] | {(.kanji): (.keyword)}]' -c > $@

