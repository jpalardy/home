
SRC_COFFEE = $(shell find src/coffee -name '*.coffee')
DST_JS     = $(patsubst src/coffee/%.coffee, public/js/%.js, $(SRC_COFFEE))

#-------------------------------------------------

public/js/%.js: src/coffee/%.coffee
	coffee -c -o $(@D) $<

#-------------------------------------------------

all: compile

compile: $(DST_JS)

clean:
	rm -rf $(DST_JS)

