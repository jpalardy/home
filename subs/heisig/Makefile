
public/heisig.min.json: public/heisig.json
	cat $< | jq '[.[] | {(.kanji): (.keyword)}]' -c > $@

