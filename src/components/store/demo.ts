import { ActionType } from './types/ActionType';
import store from './index';

/**
 * Handle changes with previous and current states
 */
const onDataChange = (): (() => void) => {
  /**
   * Initial state
   */
  let currentState = store.getState();

  /**
   * onChange handler
   */
  return (): void => {
    const prevState = currentState;

    currentState = store.getState();

    console.log('***');
    console.log('Previous state:', prevState);
    console.log('Current state:', currentState);
    console.log('***');
  };
};

const unsubscribeOnDataChange = store.subscribe(onDataChange());

const block1 = {
  id: '3JPEqh8_Wc',
  type: 'header',
  data: {
    text: 'Editor.js',
    level: 2,
  },
};

const block2 = {
  id: 'AsbMKCuatV',
  type: 'paragraph',
  data: {
    text: 'Hey. Meet the new <b>Editor</b>. On this page you can see it in action — try to edit this text.',
  },
};

const block2Changed = {
  id: 'AsbMKCuatV',
  type: 'paragraph',
  data: {
    text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
  },
};

store.dispatch({
  type: ActionType.CREATE_BLOCK,
  data: block1,
});

store.dispatch({
  type: ActionType.CREATE_BLOCK,
  data: block2,
});

store.dispatch({
  type: ActionType.CHANGE_BLOCK_DATA,
  data: block2Changed,
});

store.dispatch({
  type: ActionType.REMOVE_BLOCK,
  blockId: block1.id,
});

unsubscribeOnDataChange();
