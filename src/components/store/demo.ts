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
    console.log('Previous state:', JSON.stringify(prevState));
    console.log('Current state:', JSON.stringify(currentState));
    console.log('***');
  };
};

const unsubscribeOnDataChange = store.subscribe(onDataChange());

const data1 = {
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
        text: 'Hey. Meet the new <b>Editor</b>. On this page you can see it in action — try to edit this text.',
      },
    },
  ],
};

const data2 = {
  time: 1649592664578,
  blocks: [
    {
      id: 'AsbMKCuatV',
      type: 'paragraph',
      data: {
        text: 'Hey. Meet the new <b>Editor</b>. On this page you can see it in action — try to edit this text.',
      },
    },
  ],
};

store.dispatch({
  type: ActionType.CHANGE_EDITOR_DATA,
  data: data1,
});

store.dispatch({
  type: ActionType.CHANGE_EDITOR_DATA,
  data: data2,
});

unsubscribeOnDataChange();
