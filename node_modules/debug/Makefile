# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# Path
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

# applications
NODE ?= $(shell which node)
YARN ?= $(shell which yarn)
PKG ?= $(if $(YARN),$(YARN),$(NODE) $(shell which npm))
BROWSERIFY ?= $(NODE) $(BIN)/browserify

.FORCE:

all: dist/debug.js

install: node_modules

clean:
	@rm -rf dist

dist:
	@mkdir -p $@

dist/debug.js: node_modules browser.js debug.js dist
	@$(BROWSERIFY) \
		--standalone debug \
		. > $@

distclean: clean
	@rm -rf node_modules

node_modules: package.json
	@NODE_ENV= $(PKG) install
	@touch node_modules
	
lint: .FORCE
	eslint debug.js
	
test: .FORCE
	mocha

.PHONY: all install clean distclean
