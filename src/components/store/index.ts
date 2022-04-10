import reducer from './reducer';
import createStore from './createStore';

const initialState = {
  data: {
    time: 1649592664578,
    blocks: [
      {
        id: '3JPEqh8_Wc',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      },
      {
        id: 'AsbMKCuatV',
        type: 'paragraph',
        data: {
          text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
        },
      },
    ],
  },
};

const store = createStore(reducer, initialState);

export default store;
