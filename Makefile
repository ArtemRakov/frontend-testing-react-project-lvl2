install: install-deps

run:
	bin/page-loader.js 10

install-deps:
	npm ci

test:
	npm test

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

publish:
	npm publish

.PHONY: test

