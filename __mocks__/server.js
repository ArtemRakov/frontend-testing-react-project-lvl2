import { setupServer } from 'msw/node';
import _ from 'lodash';
import handlers from './handlers';

const getServer = (state) => {
  const copiedState = _.cloneDeep(state);

  return setupServer(...handlers(copiedState));
};

export default getServer;
