
MAKEFLAGS += -j$(shell nproc)

SUBDIRS := $(patsubst subs/%/Makefile,%,$(wildcard subs/*/Makefile))
SUBS_BUILD := $(addprefix build-,$(SUBDIRS))
SUBS_CLEAN := $(addprefix clean-,$(SUBDIRS))
SUBS_PURGE := $(addprefix purge-,$(SUBDIRS))

.PHONY: all build copy clean purge

all: build copy

# -------------------------------------------------

build: $(SUBS_BUILD)

.PHONY: $(SUBS_BUILD)
$(SUBS_BUILD): build-%:
	@$(MAKE) -C subs/$*

copy: SUBS_HOIST := home
copy: SUBS_NORMAL := $(filter-out home,$(SUBDIRS))
copy: build
	for sub in $(SUBS_NORMAL); do rsync -q -av --delete subs/$$sub/public/ public/$$sub/; done
	for sub in $(SUBS_HOIST); do rsync -q -av subs/$$sub/public/ public/; done

# -------------------------------------------------

clean: $(SUBS_CLEAN)
	rm -rf public

.PHONY: $(SUBS_CLEAN)
$(SUBS_CLEAN): clean-%:
	@$(MAKE) -C subs/$* clean

purge: $(SUBS_PURGE)
	rm -rf public

.PHONY: $(SUBS_PURGE)
$(SUBS_PURGE): purge-%:
	@$(MAKE) -C subs/$* purge

#-------------------------------------------------

.PHONY: deploy-dryrun
deploy-dryrun:
	aws s3 sync public/ s3://home.jpalardy.com/ --delete --profile jonathan --dryrun

.PHONY: deploy
deploy:
	aws s3 sync public/ s3://home.jpalardy.com/ --cache-control "public, max-age=172800" --profile jonathan
	aws cloudfront create-invalidation --distribution-id E1SGJ2SOI6A0WB --paths "/*" --profile jonathan

