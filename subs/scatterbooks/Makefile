
generate: public/data/books.json
	rm public/data/all-books.json

public/data/books.json: public/data/all-books.json
	cat $^ | jq '.[] | select(.status == "done") | select(.ml | numbers) | select(.pages | numbers) | select(.notes | contains("#audio") | not) | select(.notes | contains("#ebook") | not) | {ml, pages, image_url, year: (.done_on | split("-")[0] | tonumber)}' | jq --slurp . > $@

public/data/all-books.json:
	curl --silent 'https://bookpiles.ca/jonathan/books.json' -o - | jq . > $@

