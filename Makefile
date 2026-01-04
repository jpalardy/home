
SUBS_MAKEFILE := $(shell ls subs/*/Makefile)
SUBS_BUILD := $(SUBS_MAKEFILE:Makefile=_build)
SUBS_CLEAN := $(SUBS_MAKEFILE:Makefile=_clean)
SUBS_PURGE := $(SUBS_MAKEFILE:Makefile=_purge)

%/_build:
	make -C $(dir $@)

%/_clean:
	make -C $(dir $@) clean

%/_purge:
	make -C $(dir $@) purge

.PHONY: all
all: build copy

.PHONY: build
build: $(SUBS_BUILD)

.PHONY: copy
copy: public
	for sub in subs/*; do rsync -q -av --delete $$sub/public/ public/`basename $$sub`/; done
	mv public/home/* public/
	rmdir public/home

public:
	mkdir public

#-------------------------------------------------

.PHONY: clean
clean: $(SUBS_CLEAN)
	rm -rf public

.PHONY: purge
purge: $(SUBS_PURGE)
	rm -rf public

#-------------------------------------------------

.PHONY: deploy-dryrun
deploy-dryrun:
	aws s3 sync public/ s3://home.jpalardy.com/ --delete --profile jonathan --dryrun

.PHONY: deploy
deploy:
	aws s3 sync public/ s3://home.jpalardy.com/ --cache-control "public, max-age=172800" --profile jonathan
	aws cloudfront create-invalidation --distribution-id E1SGJ2SOI6A0WB --paths "/*" --profile jonathan

