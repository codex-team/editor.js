import createStore from '../../../../src/components/store/createStore';
import { EditorState } from '../../../../types/store/editorState';
import blocksReducer from '../../../../src/components/store/blocksReducer';
import { changeBlock, createBlock, removeBlock } from '../../../../src/components/store/actions/blockReducerActions';

describe('State manager', () => {
  it('should create the store without initial state', () => {
    const emptyReducer = (state: EditorState): EditorState => state;

    const store = createStore(emptyReducer);

    expect(store.getState()).to.deep.equal({ blocks: {} });
  });

  it('should create the store with initial state', () => {
    const emptyReducer = (state: EditorState): EditorState => state;
    const initialState = {
      blocks: {
        '3JPEqh8_Wc': {
          id: '3JPEqh8_Wc',
          type: 'header',
          data: {
            text: 'Editor.js',
            level: 2,
          },
        },
      },
    };

    const store = createStore(emptyReducer, initialState);

    expect(store.getState()).to.deep.equal(initialState);
  });

  describe('blocksReducer', () => {
    it('should create a new block in the state', () => {
      const store = createStore(blocksReducer);
      const block = {
        id: '3JPEqh8_Wc',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      };
      const expectedResult = {
        blocks: {
          '3JPEqh8_Wc': block,
        },
      };

      store.dispatch(createBlock(block));

      expect(store.getState()).to.be.deep.equal(expectedResult);
    });

    it('should change block data in the state', () => {
      const block = {
        id: '3JPEqh8_Wc',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      };
      const store = createStore(blocksReducer, {
        blocks: {
          [block.id]: block,
        },
      });
      const changedBlock = {
        ...block,
        data: {
          ...block.data,
          text: 'New Editor.js!',
        },
      };
      const expectedResult = {
        blocks: {
          [changedBlock.id]: changedBlock,
        },
      };

      store.dispatch(changeBlock(changedBlock));

      expect(store.getState()).to.be.deep.equal(expectedResult);
    });

    it('should remove block data from the state', () => {
      const block = {
        id: '3JPEqh8_Wc',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      };
      const store = createStore(blocksReducer, {
        blocks: {
          [block.id]: block,
        },
      });
      const expectedResult = {
        blocks: {},
      };

      store.dispatch(removeBlock(block.id));

      expect(store.getState()).to.be.deep.equal(expectedResult);
    });
  });
});
