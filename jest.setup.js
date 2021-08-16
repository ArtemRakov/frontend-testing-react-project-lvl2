import { toContainElement } from '@testing-library/jest-dom/matchers';
import { checkHtmlElement } from '@testing-library/jest-dom/dist/utils';

function lastElementContain(container, element) {
  checkHtmlElement(container, lastElementContain, this);

  if (element !== null) {
    checkHtmlElement(element, lastElementContain, this);
  }

  const lastElement = container.lastElementChild;
  const result = toContainElement.call(this, lastElement, element);

  return {
    pass: result.pass,
    message: () => [
      this.utils.matcherHint(
        `${this.isNot ? '.not' : ''}.toContainElement`,
        'element',
        'element',
      ),
      '',
      this.utils.RECEIVED_COLOR(`${this.utils.stringify(
        container.cloneNode(false),
      )} ${
        this.isNot ? 'last element contains:' : 'last element does not contain:'
      } ${this.utils.stringify(element ? element.cloneNode(false) : element)}
        `),
    ].join('\n'),
  };
}

expect.extend({ lastElementContain });
