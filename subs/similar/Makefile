
public/js/images.js: public/images/*
	ls public/images/ | awk 'BEGIN { print "\nvar images = ["}; {print "  \"" $$1 "\","}; END { print "];\n"}' > $@

