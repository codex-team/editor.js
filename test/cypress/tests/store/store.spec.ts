import createStore from '../../../../src/components/store/createStore';
import { EditorState } from '../../../../src/components/store/types/EditorState';
import reducer from '../../../../src/components/store/reducer';
import { ActionType } from '../../../../src/components/store/types/ActionType';

describe('State manager', () => {
  it('should create the store without initial state', () => {
    const emptyReducer = (state: EditorState): EditorState => state;

    const store = createStore(emptyReducer);

    expect(store.getState()).to.deep.equal({});
  });

  it('should create the store with initial state', () => {
    const emptyReducer = (state: EditorState): EditorState => state;
    const initialState = {
      '3JPEqh8_Wc': {
        id: '3JPEqh8_Wc',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      },
    };

    const store = createStore(emptyReducer, initialState);

    expect(store.getState()).to.deep.equal(initialState);
  });

  describe('reducer', () => {
    it('should change the state', () => {
      const store = createStore(reducer);
      const block = {
        id: '3JPEqh8_Wc',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      };
      const expectedResult = {
        '3JPEqh8_Wc': block,
      };

      store.dispatch({
        type: ActionType.CREATE_BLOCK,
        data: block,
      });

      expect(store.getState()).to.be.deep.equal(expectedResult);
    });
  });
});
