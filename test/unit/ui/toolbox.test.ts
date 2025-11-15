import { describe, it, expect, beforeEach, vi } from 'vitest';
import Toolbox, { ToolboxEvent } from '../../../src/components/ui/toolbox';
import type { API, BlockToolData, ToolboxConfigEntry, BlockAPI } from '@/types';
import type BlockToolAdapter from '../../../src/components/tools/block';
import type ToolsCollection from '../../../src/components/tools/collection';
import type { Popover } from '../../../src/components/utils/popover';
import { PopoverEvent } from '@/types/utils/popover/popover-event';
import { EditorMobileLayoutToggled } from '../../../src/components/events';
import Shortcuts from '../../../src/components/utils/shortcuts';

// Mock dependencies at module level
const mockPopoverInstance = {
  show: vi.fn(),
  hide: vi.fn(),
  destroy: vi.fn(),
  getElement: vi.fn(() => document.createElement('div')),
  on: vi.fn(),
  off: vi.fn(),
  hasFocus: vi.fn(() => false),
};

vi.mock('../../../src/components/dom', () => ({
  default: {
    make: vi.fn((tag: string, className: string) => {
      const el = document.createElement(tag);

      el.className = className;

      return el;
    }),
  },
}));

vi.mock('../../../src/components/utils/popover', () => ({
  PopoverDesktop: vi.fn().mockImplementation(() => mockPopoverInstance),
  PopoverMobile: vi.fn().mockImplementation(() => mockPopoverInstance),
}));

vi.mock('../../../src/components/utils/shortcuts', () => ({
  default: {
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../../../src/components/utils', async () => {
  const actual = await vi.importActual('../../../src/components/utils');

  return {
    ...actual,
    isMobileScreen: vi.fn(() => false),
    cacheable: (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
  };
});

vi.mock('../../../src/components/i18n', () => ({
  default: {
    t: vi.fn((namespace: string, key: string) => key),
  },
}));

/**
 * Unit tests for toolbox.ts
 *
 * Tests internal functionality and edge cases not covered by E2E tests
 */
describe('Toolbox', () => {
  const i18nLabels: Record<'filter' | 'nothingFound', string> = {
    filter: 'Filter',
    nothingFound: 'Nothing found',
  };

  const mocks = {
    api: undefined as unknown as API,
    tools: undefined as unknown as ToolsCollection<BlockToolAdapter>,
    blockToolAdapter: undefined as unknown as BlockToolAdapter,
    blockAPI: undefined as unknown as BlockAPI,
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock BlockAPI
    const blockAPI = {
      id: 'test-block-id',
      isEmpty: true,
      call: vi.fn(),
    } as unknown as BlockAPI;

    // Mock BlockToolAdapter
    const blockToolAdapter = {
      name: 'testTool',
      toolbox: {
        title: 'Test Tool',
        icon: '<svg>test</svg>',
      },
      shortcut: 'CMD+T',
    } as unknown as BlockToolAdapter;

    // Mock ToolsCollection
    const tools = new Map() as unknown as ToolsCollection<BlockToolAdapter>;

    tools.set('testTool', blockToolAdapter);
    tools.forEach = Map.prototype.forEach.bind(tools);

    // Mock API
    const api = {
      blocks: {
        getCurrentBlockIndex: vi.fn(() => 0),
        getBlockByIndex: vi.fn(() => blockAPI),
        convert: vi.fn(),
        composeBlockData: vi.fn(async () => ({})),
        insert: vi.fn(() => blockAPI),
      },
      caret: {
        setToBlock: vi.fn(),
      },
      toolbar: {
        close: vi.fn(),
      },
      ui: {
        nodes: {
          redactor: document.createElement('div'),
        },
      },
      events: {
        on: vi.fn(),
        off: vi.fn(),
      },
    } as unknown as API;

    // Update mocks object (mutation instead of reassignment)
    mocks.blockAPI = blockAPI;
    mocks.blockToolAdapter = blockToolAdapter;
    mocks.tools = tools;
    mocks.api = api;
  });

  describe('constructor', () => {
    it('should initialize toolbox with correct structure', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const element = toolbox.getElement();

      expect(element).not.toBeNull();
      expect(element?.classList.contains('ce-toolbox')).toBe(true);
    });

    it('should set data-cy attribute in test mode', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const element = toolbox.getElement();

      expect(element?.getAttribute('data-cy')).toBe('toolbox');
    });

    it('should initialize with opened = false', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      expect(toolbox.opened).toBe(false);
    });

    it('should register EditorMobileLayoutToggled event listener', () => {
      new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      expect(mocks.api.events.on).toHaveBeenCalledWith(
        EditorMobileLayoutToggled,
        expect.any(Function)
      );
    });
  });

  describe('isEmpty', () => {
    it('should return true when no tools have toolbox configuration', () => {
      const emptyTools = new Map() as unknown as ToolsCollection<BlockToolAdapter>;

      emptyTools.forEach = Map.prototype.forEach.bind(emptyTools);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: emptyTools,
        i18nLabels,
      });

      expect(toolbox.isEmpty).toBe(true);
    });

    it('should return false when tools have toolbox configuration', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      expect(toolbox.isEmpty).toBe(false);
    });

    it('should return true when tool has toolbox set to undefined', () => {
      const toolWithoutToolbox = {
        name: 'noToolboxTool',
        toolbox: undefined,
      } as unknown as BlockToolAdapter;

      const tools = new Map() as unknown as ToolsCollection<BlockToolAdapter>;

      tools.set('noToolboxTool', toolWithoutToolbox);
      tools.forEach = Map.prototype.forEach.bind(tools);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools,
        i18nLabels,
      });

      expect(toolbox.isEmpty).toBe(true);
    });
  });

  describe('getElement', () => {
    it('should return the toolbox element', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const element = toolbox.getElement();

      expect(element).not.toBeNull();
      expect(element?.tagName).toBe('DIV');
    });
  });

  describe('hasFocus', () => {
    it('should return undefined when popover is not initialized', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      // Access private popover and set to null
      (toolbox as unknown as { popover: Popover | null }).popover = null;

      expect(toolbox.hasFocus()).toBeUndefined();
    });

    it('should return popover hasFocus result when popover exists', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      mockPopoverInstance.hasFocus.mockReturnValue(true);

      expect(toolbox.hasFocus()).toBe(true);
    });
  });

  describe('open', () => {
    it('should open popover and set opened to true', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const emitSpy = vi.spyOn(toolbox, 'emit');

      toolbox.open();

      expect(mockPopoverInstance.show).toHaveBeenCalled();
      expect(toolbox.opened).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith(ToolboxEvent.Opened);
    });

    it('should not open when toolbox is empty', () => {
      const emptyTools = new Map() as unknown as ToolsCollection<BlockToolAdapter>;

      emptyTools.forEach = Map.prototype.forEach.bind(emptyTools);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: emptyTools,
        i18nLabels,
      });

      const emitSpy = vi.spyOn(toolbox, 'emit');

      toolbox.open();

      expect(mockPopoverInstance.show).not.toHaveBeenCalled();
      expect(toolbox.opened).toBe(false);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close popover and set opened to false', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.opened = true;
      const emitSpy = vi.spyOn(toolbox, 'emit');

      toolbox.close();

      expect(mockPopoverInstance.hide).toHaveBeenCalled();
      expect(toolbox.opened).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith(ToolboxEvent.Closed);
    });
  });

  describe('toggle', () => {
    it('should open when closed', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.opened = false;
      const openSpy = vi.spyOn(toolbox, 'open');

      toolbox.toggle();

      expect(openSpy).toHaveBeenCalled();
    });

    it('should close when opened', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.opened = true;
      const closeSpy = vi.spyOn(toolbox, 'close');

      toolbox.toggle();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('toolButtonActivated', () => {
    it('should call insertNewBlock with tool name and data overrides', async () => {
      // Ensure mocks return valid values before creating toolbox
      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(mocks.blockAPI);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const blockDataOverrides: BlockToolData = { test: 'data' };

      await toolbox.toolButtonActivated('testTool', blockDataOverrides);

      expect(mocks.api.blocks.insert).toHaveBeenCalled();
    });

    it('should insert block with overridden data', async () => {
      // Ensure mocks return valid values before creating toolbox
      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(mocks.blockAPI);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const blockDataOverrides: BlockToolData = { customProp: 'value' };

      await toolbox.toolButtonActivated('testTool', blockDataOverrides);

      expect(mocks.api.blocks.composeBlockData).toHaveBeenCalledWith('testTool');
    });
  });

  describe('handleMobileLayoutToggle', () => {
    it('should destroy and reinitialize popover', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.handleMobileLayoutToggle();

      expect(mockPopoverInstance.hide).toHaveBeenCalled();
      expect(mockPopoverInstance.destroy).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove toolbox element from DOM', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const element = toolbox.getElement();

      document.body.appendChild(element!);

      expect(document.body.contains(element!)).toBe(true);

      toolbox.destroy();

      expect(document.body.contains(element!)).toBe(false);
    });

    it('should remove popover event listener', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.destroy();

      expect(mockPopoverInstance.off).toHaveBeenCalledWith(
        PopoverEvent.Closed,
        expect.any(Function)
      );
    });

    it('should remove EditorMobileLayoutToggled event listener', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.destroy();

      expect(mocks.api.events.off).toHaveBeenCalledWith(
        EditorMobileLayoutToggled,
        expect.any(Function)
      );
    });

    it('should call super.destroy()', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const superDestroySpy = vi.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(toolbox)), 'destroy');

      toolbox.destroy();

      expect(superDestroySpy).toHaveBeenCalled();
    });
  });

  describe('onPopoverClose', () => {
    it('should set opened to false and emit Closed event when popover closes', () => {
      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      toolbox.opened = true;
      const emitSpy = vi.spyOn(toolbox, 'emit');

      // Simulate popover close event
      const closeHandler = (mockPopoverInstance.on as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === PopoverEvent.Closed
      )?.[1];

      if (closeHandler) {
        closeHandler();
      }

      expect(toolbox.opened).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith(ToolboxEvent.Closed);
    });
  });

  describe('toolbox items with multiple entries', () => {
    it('should handle tool with array toolbox config', () => {
      const toolWithMultipleEntries = {
        name: 'multiTool',
        toolbox: [
          {
            title: 'Entry 1',
            icon: '<svg>1</svg>',
          },
          {
            title: 'Entry 2',
            icon: '<svg>2</svg>',
          },
        ] as ToolboxConfigEntry[],
      } as unknown as BlockToolAdapter;

      const tools = new Map() as unknown as ToolsCollection<BlockToolAdapter>;

      tools.set('multiTool', toolWithMultipleEntries);
      tools.forEach = Map.prototype.forEach.bind(tools);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools,
        i18nLabels,
      });

      expect(toolbox.isEmpty).toBe(false);
    });
  });

  describe('shortcuts', () => {
    it('should enable shortcuts for tools with shortcut configuration', () => {
      new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      expect(Shortcuts.add).toHaveBeenCalled();
    });

    it('should not enable shortcuts for tools without shortcut', () => {
      const toolWithoutShortcut = {
        name: 'noShortcutTool',
        toolbox: {
          title: 'Tool',
          icon: '<svg></svg>',
        },
        shortcut: undefined,
      } as unknown as BlockToolAdapter;

      const tools = new Map() as unknown as ToolsCollection<BlockToolAdapter>;

      tools.set('noShortcutTool', toolWithoutShortcut);
      tools.forEach = Map.prototype.forEach.bind(tools);

      vi.clearAllMocks();

      new Toolbox({
        api: mocks.api,
        tools,
        i18nLabels,
      });

      // Should not be called for tools without shortcuts
      expect(Shortcuts.add).not.toHaveBeenCalled();
    });
  });

  describe('insertNewBlock', () => {
    it('should insert block at current index when block is empty', async () => {
      const emptyBlock = {
        ...mocks.blockAPI,
        isEmpty: true,
      };

      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(emptyBlock as BlockAPI);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      await toolbox.toolButtonActivated('testTool', {});

      expect(mocks.api.blocks.insert).toHaveBeenCalledWith(
        'testTool',
        undefined,
        undefined,
        0,
        undefined,
        true
      );
    });

    it('should insert block at next index when block is not empty', async () => {
      const nonEmptyBlock = {
        ...mocks.blockAPI,
        isEmpty: false,
      };

      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(nonEmptyBlock as BlockAPI);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      await toolbox.toolButtonActivated('testTool', {});

      expect(mocks.api.blocks.insert).toHaveBeenCalledWith(
        'testTool',
        undefined,
        undefined,
        1,
        undefined,
        false
      );
    });

    it('should emit BlockAdded event after inserting block', async () => {
      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(mocks.blockAPI);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const emitSpy = vi.spyOn(toolbox, 'emit');

      await toolbox.toolButtonActivated('testTool', {});

      expect(emitSpy).toHaveBeenCalledWith(ToolboxEvent.BlockAdded, {
        block: mocks.blockAPI,
      });
    });

    it('should close toolbar after inserting block', async () => {
      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(mocks.blockAPI);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      await toolbox.toolButtonActivated('testTool', {});

      expect(mocks.api.toolbar.close).toHaveBeenCalled();
    });

    it('should not insert block when current block is null', async () => {
      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(undefined);

      const toolbox = new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      await toolbox.toolButtonActivated('testTool', {});

      expect(mocks.api.blocks.insert).not.toHaveBeenCalled();
    });
  });

  describe('shortcut handler', () => {
    it('should convert block when conversion is possible', async () => {
      new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      const convertedBlock = { id: 'converted-block' } as BlockAPI;

      vi.mocked(mocks.api.blocks.convert).mockResolvedValue(convertedBlock);

      const addCalls = vi.mocked(Shortcuts.add).mock.calls;
      const addCall = addCalls[0]?.[0];

      if (addCall && addCall.handler) {
        const event = { preventDefault: vi.fn() } as unknown as KeyboardEvent;

        await addCall.handler(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mocks.api.blocks.convert).toHaveBeenCalled();
        expect(mocks.api.caret.setToBlock).toHaveBeenCalledWith(convertedBlock, 'end');
      }
    });

    it('should insert new block when conversion fails', async () => {
      new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      vi.mocked(mocks.api.blocks.convert).mockRejectedValue(new Error('Conversion failed'));

      const addCalls = vi.mocked(Shortcuts.add).mock.calls;
      const addCall = addCalls[0]?.[0];

      if (addCall && addCall.handler) {
        const event = { preventDefault: vi.fn() } as unknown as KeyboardEvent;

        await addCall.handler(event);

        expect(mocks.api.blocks.insert).toHaveBeenCalled();
      }
    });

    it('should call insertNewBlock when current block is null but it returns early', async () => {
      new Toolbox({
        api: mocks.api,
        tools: mocks.tools,
        i18nLabels,
      });

      vi.mocked(mocks.api.blocks.getCurrentBlockIndex).mockReturnValue(0);
      vi.mocked(mocks.api.blocks.getBlockByIndex).mockReturnValue(undefined);

      const addCalls = vi.mocked(Shortcuts.add).mock.calls;
      const addCall = addCalls[0]?.[0];

      if (addCall && addCall.handler) {
        const event = { preventDefault: vi.fn() } as unknown as KeyboardEvent;

        await addCall.handler(event);

        // insertNewBlock is called but returns early when currentBlock is null
        // so blocks.insert should not be called
        expect(mocks.api.blocks.insert).not.toHaveBeenCalled();
      }
    });
  });
});
