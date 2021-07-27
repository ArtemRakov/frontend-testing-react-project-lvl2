// eslint-disable-next-line jest/no-mocks-import
import { server } from './__mocks__/server.js'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
