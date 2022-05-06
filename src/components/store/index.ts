import blocksReducer from './blocksReducer';
import createStore from './createStore';

const store = createStore(blocksReducer);

export default store;
