import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import RectangleSelection from '../../../../src/components/modules/rectangleSelection';
import Block from '../../../../src/components/block';
import SelectionUtils from '../../../../src/components/selection';
import EventsDispatcher from '../../../../src/components/utils/events';
import type { EditorEventMap } from '../../../../src/components/events';
import type { EditorModules } from '../../../../src/types-internal/editor-modules';
import type { EditorConfig } from '../../../../types';
import type BlockType from '../../../../src/components/block';

type PartialModules = Partial<EditorModules>;

type ToolbarModuleMock = {
  CSS: { toolbar: string };
  close: Mock<[], void>;
};

type InlineToolbarModuleMock = {
  CSS: { inlineToolbar: string };
  close: Mock<[], void>;
};

type BlockSelectionModuleMock = {
  allBlocksSelected: boolean;
  selectBlockByIndex: Mock<[number], void>;
  unSelectBlockByIndex: Mock<[number], void>;
};

type BlockManagerModuleMock = {
  blocks: BlockType[];
  getBlockByChildNode: Mock<[Node], BlockType | undefined>;
  getBlockByIndex: Mock<[number], BlockType | undefined>;
  lastBlock: { holder: HTMLElement };
};

interface RectangleSelectionTestSetup {
  rectangleSelection: RectangleSelection;
  modules: PartialModules;
  editorWrapper: HTMLDivElement;
  holder: HTMLDivElement;
  blockContent: HTMLDivElement;
  toolbar: ToolbarModuleMock;
  inlineToolbar: InlineToolbarModuleMock;
  blockSelection: BlockSelectionModuleMock;
  blockManager: BlockManagerModuleMock;
}

const createRectangleSelection = (overrides: PartialModules = {}): RectangleSelectionTestSetup => {
  const rectangleSelection = new RectangleSelection({
    config: {} as EditorConfig,
    eventsDispatcher: new EventsDispatcher<EditorEventMap>(),
  });

  const holder = document.createElement('div');
  const editorWrapper = document.createElement('div');
  const editorWrapperClass = 'codex-editor__redactor';

  editorWrapper.className = editorWrapperClass;
  holder.appendChild(editorWrapper);
  document.body.appendChild(holder);

  const blockContent = document.createElement('div');

  blockContent.className = Block.CSS.content;
  blockContent.style.width = '400px';

  const lastBlockHolder = document.createElement('div');

  lastBlockHolder.appendChild(blockContent);

  const blocks: BlockType[] = [];

  const toolbarMock: ToolbarModuleMock = {
    CSS: {
      toolbar: 'codex-editor-toolbar',
    },
    close: vi.fn<[], void>(),
  };

  const inlineToolbarMock: InlineToolbarModuleMock = {
    CSS: {
      inlineToolbar: 'codex-editor-inline-toolbar',
    },
    close: vi.fn<[], void>(),
  };

  const blockSelectionMock: BlockSelectionModuleMock = {
    allBlocksSelected: false,
    selectBlockByIndex: vi.fn<[number], void>(),
    unSelectBlockByIndex: vi.fn<[number], void>(),
  };

  const blockManagerMock: BlockManagerModuleMock = {
    blocks,
    getBlockByChildNode: vi.fn<[Node], BlockType | undefined>(),
    getBlockByIndex: vi.fn<[number], BlockType | undefined>((index) => blocks[index]),
    lastBlock: {
      holder: lastBlockHolder,
    },
  };

  const defaults: PartialModules = {
    UI: {
      nodes: {
        holder,
      },
      CSS: {
        editorWrapper: editorWrapperClass,
      },
    } as unknown as EditorModules['UI'],
    Toolbar: toolbarMock as unknown as EditorModules['Toolbar'],
    InlineToolbar: inlineToolbarMock as unknown as EditorModules['InlineToolbar'],
    BlockSelection: blockSelectionMock as unknown as EditorModules['BlockSelection'],
    BlockManager: blockManagerMock as unknown as EditorModules['BlockManager'],
  };

  const mergedState: PartialModules = { ...defaults };

  for (const [moduleName, moduleOverrides] of Object.entries(overrides) as Array<[keyof EditorModules, unknown]>) {
    if (moduleOverrides === undefined) {
      continue;
    }

    const existingModule = mergedState[moduleName];

    if (
      existingModule !== undefined &&
      existingModule !== null &&
      typeof existingModule === 'object' &&
      moduleOverrides !== null &&
      typeof moduleOverrides === 'object'
    ) {
      Object.assign(
        existingModule as unknown as Record<string, unknown>,
        moduleOverrides as unknown as Record<string, unknown>
      );
    } else {
      (mergedState as Record<keyof EditorModules, EditorModules[keyof EditorModules]>)[moduleName] = moduleOverrides as EditorModules[typeof moduleName];
    }
  }

  rectangleSelection.state = mergedState as EditorModules;

  return {
    rectangleSelection,
    modules: mergedState,
    editorWrapper,
    holder,
    blockContent,
    toolbar: toolbarMock,
    inlineToolbar: inlineToolbarMock,
    blockSelection: blockSelectionMock,
    blockManager: blockManagerMock,
  };
};

describe('RectangleSelection', () => {
  beforeAll(() => {
    if (typeof document.elementFromPoint !== 'function') {
      Object.defineProperty(document, 'elementFromPoint', {
        configurable: true,
        writable: true,
        value: () => document.createElement('div'),
      });
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates overlay container on prepare', () => {
    const {
      rectangleSelection,
      editorWrapper,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const overlay = editorWrapper.querySelector(`.${RectangleSelection.CSS.overlay}`);
    const rectangle = editorWrapper.querySelector(`.${RectangleSelection.CSS.rect}`);

    expect(overlay).not.toBeNull();
    expect(rectangle).not.toBeNull();
  });

  it('starts selection inside the editor and resets selection state', () => {
    const {
      rectangleSelection,
      blockSelection,
      editorWrapper,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      stackOfSelected: number[];
      isRectSelectionActivated: boolean;
      mousedown: boolean;
      startX: number;
      startY: number;
    };

    internal.stackOfSelected.push(1, 2);
    internal.isRectSelectionActivated = true;

    blockSelection.allBlocksSelected = true;

    const startTarget = document.createElement('div');

    editorWrapper.appendChild(startTarget);

    const elementFromPointSpy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(startTarget);

    rectangleSelection.startSelection(120, 240);

    expect(blockSelection.allBlocksSelected).toBe(false);
    expect(internal.stackOfSelected).toEqual([]);
    expect(internal.isRectSelectionActivated).toBe(false);
    expect(internal.mousedown).toBe(true);
    expect(internal.startX).toBe(120);
    expect(internal.startY).toBe(240);

    elementFromPointSpy.mockRestore();
  });

  it('ignores selection start initiated from the toolbar', () => {
    const {
      rectangleSelection,
      blockSelection,
      toolbar,
    } = createRectangleSelection();

    blockSelection.allBlocksSelected = true;

    const toolbarClass = toolbar.CSS.toolbar;
    const toolbarElement = document.createElement('div');

    toolbarElement.className = toolbarClass;
    const toolbarChild = document.createElement('div');

    toolbarElement.appendChild(toolbarChild);
    document.body.appendChild(toolbarElement);

    const elementFromPointSpy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(toolbarChild);

    const internal = rectangleSelection as unknown as { mousedown: boolean };

    rectangleSelection.startSelection(10, 20);

    expect(blockSelection.allBlocksSelected).toBe(true);
    expect(internal.mousedown).toBe(false);

    elementFromPointSpy.mockRestore();
  });

  it('ignores selection attempts outside of selectable area', () => {
    const {
      rectangleSelection,
      editorWrapper,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as { mousedown: boolean };

    const outsideNode = document.createElement('div');

    document.body.appendChild(outsideNode);

    const elementFromPointSpy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(outsideNode);

    rectangleSelection.startSelection(10, 15);

    expect(internal.mousedown).toBe(false);

    const blockContent = document.createElement('div');

    blockContent.className = Block.CSS.content;
    editorWrapper.appendChild(blockContent);
    elementFromPointSpy.mockReturnValue(blockContent);

    rectangleSelection.startSelection(20, 25);

    expect(internal.mousedown).toBe(false);

    elementFromPointSpy.mockRestore();
  });

  it('clears selection activation flag when clearSelection is called', () => {
    const { rectangleSelection } = createRectangleSelection();
    const internal = rectangleSelection as unknown as { isRectSelectionActivated: boolean };

    internal.isRectSelectionActivated = true;
    rectangleSelection.clearSelection();

    expect(internal.isRectSelectionActivated).toBe(false);
  });

  it('reports whether rectangle selection is active', () => {
    const { rectangleSelection } = createRectangleSelection();
    const internal = rectangleSelection as unknown as { isRectSelectionActivated: boolean };

    internal.isRectSelectionActivated = false;
    expect(rectangleSelection.isRectActivated()).toBe(false);

    internal.isRectSelectionActivated = true;
    expect(rectangleSelection.isRectActivated()).toBe(true);
  });

  it('resets selection parameters on endSelection', () => {
    const {
      rectangleSelection,
      editorWrapper,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const internal = rectangleSelection as unknown as {
      mousedown: boolean;
      startX: number;
      startY: number;
      overlayRectangle: HTMLDivElement;
    };

    internal.mousedown = true;
    internal.startX = 50;
    internal.startY = 60;
    internal.overlayRectangle = editorWrapper.querySelector(`.${RectangleSelection.CSS.rect}`) as HTMLDivElement;
    internal.overlayRectangle.style.display = 'block';

    rectangleSelection.endSelection();

    expect(internal.mousedown).toBe(false);
    expect(internal.startX).toBe(0);
    expect(internal.startY).toBe(0);
    expect(internal.overlayRectangle.style.display).toBe('none');
  });

  it('starts selection only for the main mouse button', () => {
    const {
      rectangleSelection,
    } = createRectangleSelection();

    const startSelectionSpy = vi.spyOn(rectangleSelection, 'startSelection');

    const internal = rectangleSelection as unknown as {
      processMouseDown: (event: MouseEvent) => void;
    };

    const primaryEvent = {
      button: 0,
      pageX: 150,
      pageY: 200,
      target: document.createElement('div'),
    } as unknown as MouseEvent;

    internal.processMouseDown(primaryEvent);

    expect(startSelectionSpy).toHaveBeenCalledWith(150, 200);

    startSelectionSpy.mockClear();

    const secondaryEvent = {
      button: 1,
      pageX: 150,
      pageY: 200,
      target: document.createElement('div'),
    } as unknown as MouseEvent;

    internal.processMouseDown(secondaryEvent);

    expect(startSelectionSpy).not.toHaveBeenCalled();
  });

  it('delegates mouse move handling to rectangle updates and scroll zones', () => {
    const {
      rectangleSelection,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      processMouseMove: (event: MouseEvent) => void;
      changingRectangle: (event: MouseEvent) => void;
      scrollByZones: (clientY: number) => void;
    };

    const changeSpy = vi.spyOn(internal, 'changingRectangle');
    const scrollSpy = vi.spyOn(internal, 'scrollByZones');

    const mouseEvent = {
      clientY: 320,
    } as unknown as MouseEvent;

    internal.processMouseMove(mouseEvent);

    expect(changeSpy).toHaveBeenCalledWith(mouseEvent);
    expect(scrollSpy).toHaveBeenCalledWith(320);
  });

  it('updates rectangle on scroll events', () => {
    const {
      rectangleSelection,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      processScroll: (event: MouseEvent) => void;
      changingRectangle: (event: MouseEvent) => void;
    };

    const changeSpy = vi.spyOn(internal, 'changingRectangle');
    const scrollEvent = { pageX: 50,
      pageY: 75 } as unknown as MouseEvent;

    internal.processScroll(scrollEvent);

    expect(changeSpy).toHaveBeenCalledWith(scrollEvent);
  });

  it('stops scrolling when cursor leaves scroll zones', () => {
    const { rectangleSelection } = createRectangleSelection();
    const internal = rectangleSelection as unknown as {
      scrollByZones: (clientY: number) => void;
      isScrolling: boolean;
      inScrollZone: number | null;
    };

    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 1000,
    });

    internal.isScrolling = true;
    internal.scrollByZones(200);

    expect(internal.isScrolling).toBe(false);
    expect(internal.inScrollZone).toBeNull();
  });

  it('triggers vertical scrolling when mouse enters scroll zones', () => {
    const {
      rectangleSelection,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      scrollByZones: (clientY: number) => void;
      scrollVertical: (speed: number) => void;
      isScrolling: boolean;
    };

    const scrollSpy = vi.spyOn(internal, 'scrollVertical').mockImplementation(() => undefined);

    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 1000,
    });

    internal.isScrolling = false;
    internal.scrollByZones(10);
    expect(scrollSpy).toHaveBeenCalledWith(-3);

    internal.isScrolling = false;
    scrollSpy.mockClear();
    internal.scrollByZones(995);
    expect(scrollSpy).toHaveBeenCalledWith(3);
  });

  it('scrolls vertically while mouse button is pressed in a scroll zone', () => {
    const { rectangleSelection } = createRectangleSelection();
    const internal = rectangleSelection as unknown as {
      scrollVertical: (speed: number) => void;
      inScrollZone: number | null;
      mousedown: boolean;
      mouseY: number;
    };

    vi.useFakeTimers();

    internal.inScrollZone = 1;
    internal.mousedown = true;
    internal.mouseY = 100;

    let yOffset = 0;

    const scrollYSpy = vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => yOffset);

    const scrollBySpy = vi.spyOn(window, 'scrollBy').mockImplementation((_x, y) => {
      yOffset += y;
    });

    internal.scrollVertical(5);

    internal.inScrollZone = null;
    vi.runOnlyPendingTimers();
    vi.useRealTimers();

    expect(scrollBySpy).toHaveBeenCalledWith(0, 5);
    expect(internal.mouseY).toBe(105);

    scrollBySpy.mockRestore();
    scrollYSpy.mockRestore();
  });

  it('shrinks overlay rectangle to the starting point', () => {
    const {
      rectangleSelection,
      editorWrapper,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const internal = rectangleSelection as unknown as {
      shrinkRectangleToPoint: () => void;
      overlayRectangle: HTMLDivElement;
      startX: number;
      startY: number;
    };

    internal.overlayRectangle = editorWrapper.querySelector(`.${RectangleSelection.CSS.rect}`) as HTMLDivElement;
    internal.startX = 150;
    internal.startY = 260;

    const scrollXSpy = vi.spyOn(window, 'scrollX', 'get').mockReturnValue(10);
    const scrollYSpy = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(20);

    internal.shrinkRectangleToPoint();

    expect(internal.overlayRectangle.style.left).toBe('140px');
    expect(internal.overlayRectangle.style.top).toBe('240px');
    expect(internal.overlayRectangle.style.bottom).toBe('calc(100% - 240px)');
    expect(internal.overlayRectangle.style.right).toBe('calc(100% - 140px)');

    scrollXSpy.mockRestore();
    scrollYSpy.mockRestore();
  });

  it('selects or unselects blocks based on rectangle overlap', () => {
    const {
      rectangleSelection,
      blockSelection,
      blockManager,
    } = createRectangleSelection();

    const selectedBlockState = { selected: false } as unknown as BlockType & { selected: boolean };

    blockManager.getBlockByIndex.mockReturnValue(selectedBlockState);

    const internal = rectangleSelection as unknown as {
      stackOfSelected: number[];
      rectCrossesBlocks: boolean;
      inverseSelection: () => void;
    };

    internal.stackOfSelected.push(0, 1);
    internal.rectCrossesBlocks = true;

    internal.inverseSelection();

    expect(blockSelection.selectBlockByIndex).toHaveBeenCalledWith(0);
    expect(blockSelection.selectBlockByIndex).toHaveBeenCalledWith(1);
    expect(blockSelection.unSelectBlockByIndex).not.toHaveBeenCalled();

    blockSelection.selectBlockByIndex.mockClear();
    selectedBlockState.selected = true;
    internal.rectCrossesBlocks = false;

    internal.inverseSelection();

    expect(blockSelection.unSelectBlockByIndex).toHaveBeenCalledWith(0);
    expect(blockSelection.unSelectBlockByIndex).toHaveBeenCalledWith(1);
    expect(blockSelection.selectBlockByIndex).not.toHaveBeenCalled();
  });

  it('adds blocks to selection stack via addBlockInSelection', () => {
    const {
      rectangleSelection,
      blockSelection,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      rectCrossesBlocks: boolean;
      stackOfSelected: number[];
      addBlockInSelection: (index: number) => void;
    };

    internal.rectCrossesBlocks = true;
    internal.addBlockInSelection(2);

    expect(blockSelection.selectBlockByIndex).toHaveBeenCalledWith(2);
    expect(internal.stackOfSelected).toEqual([ 2 ]);

    blockSelection.selectBlockByIndex.mockClear();
    internal.rectCrossesBlocks = false;
    internal.addBlockInSelection(3);

    expect(blockSelection.selectBlockByIndex).not.toHaveBeenCalled();
    expect(internal.stackOfSelected).toEqual([2, 3]);
  });

  it('updates rectangle size based on cursor position', () => {
    const {
      rectangleSelection,
      editorWrapper,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const internal = rectangleSelection as unknown as {
      overlayRectangle: HTMLDivElement;
      startX: number;
      startY: number;
      mouseX: number;
      mouseY: number;
      updateRectangleSize: () => void;
    };

    internal.overlayRectangle = editorWrapper.querySelector(`.${RectangleSelection.CSS.rect}`) as HTMLDivElement;
    internal.startX = 100;
    internal.startY = 150;
    internal.mouseX = 200;
    internal.mouseY = 250;

    internal.updateRectangleSize();

    expect(internal.overlayRectangle.style.left).toBe('100px');
    expect(internal.overlayRectangle.style.top).toBe('150px');
    expect(internal.overlayRectangle.style.right).toBe('calc(100% - 200px)');
    expect(internal.overlayRectangle.style.bottom).toBe('calc(100% - 250px)');
  });

  it('computes block information for current cursor position', () => {
    const {
      rectangleSelection,
      blockManager,
      blockContent,
    } = createRectangleSelection();

    const blockHolder = document.createElement('div');

    blockHolder.appendChild(blockContent);

    const block = {
      holder: blockHolder,
    } as unknown as BlockType;

    blockManager.blocks.push(block);
    blockManager.lastBlock = {
      holder: blockHolder,
    };

    blockManager.getBlockByChildNode.mockReturnValue(block);

    Object.defineProperty(document.body, 'offsetWidth', {
      configurable: true,
      value: 800,
    });

    const internal = rectangleSelection as unknown as {
      mouseY: number;
      genInfoForMouseSelection: () => { index: number; leftPos: number; rightPos: number };
    };

    internal.mouseY = 300;

    const elementFromPointSpy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(blockHolder);

    const result = internal.genInfoForMouseSelection();

    expect(result.index).toBe(0);
    expect(result.leftPos).toBe(200);
    expect(result.rightPos).toBe(600);

    elementFromPointSpy.mockRestore();
  });

  it('activates rectangle selection and updates state when cursor moves with pressed mouse', () => {
    const {
      rectangleSelection,
      toolbar,
      editorWrapper,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const internal = rectangleSelection as unknown as {
      changingRectangle: (event: MouseEvent) => void;
      mousedown: boolean;
      isRectSelectionActivated: boolean;
      overlayRectangle: HTMLDivElement;
    };

    internal.mousedown = true;
    internal.isRectSelectionActivated = false;
    internal.overlayRectangle = editorWrapper.querySelector(`.${RectangleSelection.CSS.rect}`) as HTMLDivElement;

    const genInfoSpy = vi.spyOn(
      rectangleSelection as unknown as { genInfoForMouseSelection: () => { rightPos: number; leftPos: number; index: number } },
      'genInfoForMouseSelection'
    ).mockReturnValue({
      leftPos: 0,
      rightPos: 500,
      index: 1,
    });
    const trySelectSpy = vi.spyOn(
      rectangleSelection as unknown as { trySelectNextBlock: (index: number) => void },
      'trySelectNextBlock'
    );
    const inverseSpy = vi.spyOn(
      rectangleSelection as unknown as { inverseSelection: () => void },
      'inverseSelection'
    );
    const selectionRemove = vi.fn();
    const selectionSpy = vi.spyOn(SelectionUtils, 'get').mockReturnValue({
      removeAllRanges: selectionRemove,
    } as unknown as Selection);

    internal.changingRectangle({
      pageX: 200,
      pageY: 220,
    } as MouseEvent);

    expect(internal.isRectSelectionActivated).toBe(true);
    expect(internal.overlayRectangle.style.display).toBe('block');
    expect(toolbar.close).toHaveBeenCalled();
    expect(trySelectSpy).toHaveBeenCalledWith(1);
    expect(inverseSpy).toHaveBeenCalled();
    expect(selectionRemove).toHaveBeenCalled();

    genInfoSpy.mockRestore();
    selectionSpy.mockRestore();
  });

  it('does not attempt block selection when no block is detected under cursor', () => {
    const {
      rectangleSelection,
      toolbar,
      editorWrapper,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const internal = rectangleSelection as unknown as {
      changingRectangle: (event: MouseEvent) => void;
      mousedown: boolean;
      isRectSelectionActivated: boolean;
      overlayRectangle: HTMLDivElement;
    };

    internal.mousedown = true;
    internal.isRectSelectionActivated = true;
    internal.overlayRectangle = editorWrapper.querySelector(`.${RectangleSelection.CSS.rect}`) as HTMLDivElement;

    const genInfoSpy = vi.spyOn(
      rectangleSelection as unknown as { genInfoForMouseSelection: () => { rightPos: number; leftPos: number; index: number | undefined } },
      'genInfoForMouseSelection'
    ).mockReturnValue({
      leftPos: 0,
      rightPos: 500,
      index: undefined,
    });
    const trySelectSpy = vi.spyOn(
      rectangleSelection as unknown as { trySelectNextBlock: (index: number) => void },
      'trySelectNextBlock'
    );
    const selectionSpy = vi.spyOn(SelectionUtils, 'get');

    internal.changingRectangle({
      pageX: 120,
      pageY: 140,
    } as MouseEvent);

    expect(toolbar.close).toHaveBeenCalled();
    expect(trySelectSpy).not.toHaveBeenCalled();
    expect(selectionSpy).not.toHaveBeenCalled();

    genInfoSpy.mockRestore();
    selectionSpy.mockRestore();
  });

  it('clears selection state on mouse leave and mouse up events', () => {
    const {
      rectangleSelection,
    } = createRectangleSelection();

    rectangleSelection.prepare();

    const internal = rectangleSelection as unknown as {
      processMouseLeave: () => void;
      processMouseUp: () => void;
      clearSelection: () => void;
      endSelection: () => void;
    };

    const clearSpy = vi.spyOn(internal, 'clearSelection');
    const endSpy = vi.spyOn(internal, 'endSelection');

    internal.processMouseLeave();
    internal.processMouseUp();

    expect(clearSpy).toHaveBeenCalledTimes(2);
    expect(endSpy).toHaveBeenCalledTimes(2);
  });

  it('extends selection to skipped blocks in downward direction', () => {
    const {
      rectangleSelection,
      blockSelection,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      stackOfSelected: number[];
      rectCrossesBlocks: boolean;
      trySelectNextBlock: (index: number) => void;
    };

    internal.stackOfSelected.push(0, 1);
    internal.rectCrossesBlocks = true;

    internal.trySelectNextBlock(4);

    expect(internal.stackOfSelected).toEqual([0, 1, 2, 3, 4]);
    expect(blockSelection.selectBlockByIndex).toHaveBeenCalledWith(2);
    expect(blockSelection.selectBlockByIndex).toHaveBeenCalledWith(3);
    expect(blockSelection.selectBlockByIndex).toHaveBeenCalledWith(4);
  });

  it('shrinks selection stack when cursor moves backwards', () => {
    const {
      rectangleSelection,
      blockSelection,
    } = createRectangleSelection();

    const internal = rectangleSelection as unknown as {
      stackOfSelected: number[];
      rectCrossesBlocks: boolean;
      trySelectNextBlock: (index: number) => void;
    };

    internal.stackOfSelected.push(0, 1, 2, 3);
    internal.rectCrossesBlocks = true;

    internal.trySelectNextBlock(1);

    expect(internal.stackOfSelected).toEqual([0, 1]);
    expect(blockSelection.unSelectBlockByIndex).toHaveBeenCalledWith(3);
    expect(blockSelection.unSelectBlockByIndex).toHaveBeenCalledWith(2);
  });
});
