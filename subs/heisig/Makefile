
all: public/js/app.js

public/js/app.js:
	cat src/js/app.js src/js/models.js src/js/views.js src/js/routers.js > $@

clean:
	rm -rf public/js/app.js

