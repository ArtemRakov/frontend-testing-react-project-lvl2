// eslint-disable-next-line jest/no-mocks-import
import { server } from './__mocks__/server.js'
import { getMatchers } from "expect/build/jestMatchersObject";

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


expect.extend({
  lastElementContain(container, element) {
    const lastElement = container.lastElementChild;
    const { pass } = getMatchers().toContainElement(lastElement, element);

    return {
      pass,
      message: () => {
        return [
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
        ].join('\n')
      },
    }
  }
})
