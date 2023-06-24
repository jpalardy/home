
SUBS_MAKEFILE := $(shell ls subs/*/Makefile)
SUBS_BUILD := $(SUBS_MAKEFILE:Makefile=_build)
SUBS_CLEAN := $(SUBS_MAKEFILE:Makefile=_clean)

%/_build:
	make -C $(dir $@)

%/_clean:
	make -C $(dir $@) clean

.PHONY: all
all: build copy

.PHONY: build
build: $(SUBS_BUILD)

.PHONY: copy
copy: public
	for sub in subs/*; do rsync -q -av --delete $$sub/public/ public/`basename $$sub`/; done
	rm public/app.*.js
	mv public/home/* public/
	rmdir public/home

public:
	mkdir public

#-------------------------------------------------

.PHONY: clean
clean: $(SUBS_CLEAN)
	rm -rf public

#-------------------------------------------------

.PHONY: deploy-dryrun
deploy-dryrun:
	aws s3 sync public/ s3://home.jpalardy.com/ --delete --profile jonathan --dryrun

.PHONY: deploy
deploy:
	aws s3 sync public/ s3://home.jpalardy.com/ --profile jonathan
	aws cloudfront create-invalidation --distribution-id E1SGJ2SOI6A0WB --paths "/*" --profile jonathan

