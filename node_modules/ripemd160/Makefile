test: node-test browser-test

node-test:
	@./node_modules/.bin/mocha 

browser-test:
	@./node_modules/.bin/mochify --wd -R spec

browser-manual-test:
	node browser-test.js

.PHONY: node-test browser-test