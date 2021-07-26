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

start:
	npx @hexlet/react-todo-app-with-backend

.PHONY: test

