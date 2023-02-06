
SUBPROJECTS = subs/heisig/ subs/heisig-v1/ subs/sign/ subs/volume/ subs/isk/

.PHONY: subs
subs: public
	for sub in $(SUBPROJECTS); do (cd $$sub; pwd; make clean && make); done
	for sub in subs/*; do rsync -q -av --delete $$sub/public/ public/`basename $$sub`/; done

public:
	mkdir public

#-------------------------------------------------

.PHONY: clean
clean:
	rm -rf public
	rm -f deploy.retry
	rm -rf coverage/ .nyc_output/
	rm -rf dist

#-------------------------------------------------

.PHONY: deploy-dryrun
deploy-dryrun:
	aws s3 sync public/ s3://home.jpalardy.com/ --delete --profile jonathan --dryrun

.PHONY: deploy
deploy:
	aws s3 sync public/ s3://home.jpalardy.com/ --profile jonathan
	aws cloudfront create-invalidation --distribution-id E1SGJ2SOI6A0WB --paths "/*" --profile jonathan

