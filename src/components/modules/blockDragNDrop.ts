import Module from '../__module';
import Block from '../block';
import { BlockHovered } from '../events/BlockHovered';
import SelectionUtils from '../selection';

enum DropPosition {
  Top,
  Bottom,
}

/**
 * Module that handles drag and drop functionality for blocks.
 */
export default class BlockDragNDrop extends Module {
  private static CSS = {
    dragWrapper: 'ce-drag-wrapper',
    dragImage: 'ce-drag-image',
    dropHolder: 'ce-drop-holder',
  };

  /**
   * Custom data attributes that allow consumers to customize drag-and-drop scrolling behavior.
   *
   * These attributes can be added to the editor holder element to control how auto-scrolling works when
   * dragging blocks near the edges of the viewport.
   *
   * @property {string} topScrollThreshold - Attribute to customize the distance (in pixels) from the top edge
   *                                       that triggers scrolling. Must be a positive number.
   * @property {string} bottomScrollThreshold - Attribute to customize the distance (in pixels) from the bottom edge
   *                                          that triggers scrolling. Must be a positive number.
   * @example
   * HTML example of customization on the editor holder element:
   * <div class="codex-editor" data-ce-top-scroll-threshold="150" data-ce-bottom-scroll-threshold="80">
   *   <!-- Editor content -->
   * </div>
   */
  private customDataAttributes = {
    topScrollThreshold: 'data-ce-top-scroll-threshold',
    bottomScrollThreshold: 'data-ce-bottom-scroll-threshold',
  };

  private dragSourceBlockId: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private SCROLL_SPEED = 25; // Base scroll speed in pixels
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private DRAG_SCROLL_THRESHOLD = 100; // Distance from edge to trigger scroll

  private scrollAnimationId: number | null = null;
  private scrollContainerCache: HTMLElement | null = null;
  private dropTargetArgs: ReturnType<typeof this.findDropTarget> | null = null;
  private hoveredBlock: Block | null = null;

  private dropTargetEvents = {
    dragover: (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }

      if (this.isDragOverEventSame(event)) {
        return;
      }

      this.handleAutoScroll(event.clientY);

      this.removeDropHolder();
      this.createDropHolder();
    },

    dragleave: () => {
      this.stopAutoScroll();
      this.removeDropHolder();
      this.dropTargetArgs = null;
    },

    drop: () => {
      this.stopAutoScroll();

      if (this.dropTargetArgs == null || this.dragSourceBlockId == null) {
        return;
      }

      const { BlockManager, BlockSelection } = this.Editor;
      const { block, position } = this.dropTargetArgs;

      const dragSource = BlockManager.getBlockById(this.dragSourceBlockId);
      const dropTarget = block;

      if (dragSource != null && dropTarget != null) {
        const sourceBlockIndex = BlockManager.getBlockIndex(dragSource);
        let targetBlockIndex = BlockManager.getBlockIndex(dropTarget);

        if (position === DropPosition.Bottom) {
          targetBlockIndex++;
        }

        if (sourceBlockIndex < targetBlockIndex) {
          targetBlockIndex--;
        }

        if (targetBlockIndex !== sourceBlockIndex) {
          BlockManager.move(targetBlockIndex, sourceBlockIndex);
          BlockSelection.selectBlockByIndex(targetBlockIndex);
        }
      }

      this.removeDropHolder();

      this.removeDragImage();
      this.dropTargetArgs = null;
      this.dragSourceBlockId = null;
    },
  };

  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      window.requestIdleCallback(
        () => {
          this.enableModuleBindings();
          this.initHoveredBlockListener();
        },
        { timeout: 2000 }
      );
    } else {
      this.disableModuleBindings();
      this.destroy();
    }
  }

  /**
   * listens to the block hovered event and sets the hoveredBlock property
   */
  private initHoveredBlockListener(): void {
    this.eventsDispatcher.on(BlockHovered, (data) => {
      this.hoveredBlock = data.block;
    });
  }

  /**
   * Enables the drag handle by setting its draggable attribute and adds the associated event bindings.
   */
  private enableModuleBindings(): void {
    const dragHandle = this.Editor.Toolbar.nodes.settingsToggler;

    if (dragHandle) {
      dragHandle.setAttribute('draggable', 'true');

      this.readOnlyMutableListeners.on(
        dragHandle,
        'dragstart',
        (event: Event) => {
          const { BlockSettings } = this.Editor;

          // close the tool settings popover
          BlockSettings.close();
          // clear any selection to prevent interference with drag and drop
          SelectionUtils.get()?.removeAllRanges();

          const dragSourceBlock = this.hoveredBlock;

          if (
            dragSourceBlock != null &&
            event instanceof DragEvent &&
            event.dataTransfer
          ) {
            this.registerBlockEvents();

            this.dragSourceBlockId = dragSourceBlock.id;
            const dragImage = this.createDragImage(dragSourceBlock);

            event.dataTransfer.setDragImage(dragImage, 0, 0);
            event.dataTransfer.effectAllowed = 'move';
          }
        },
        { passive: true,
          capture: true }
      );

      this.readOnlyMutableListeners.on(
        dragHandle,
        'dragend',
        () => {
          this.clearResources();
        },
        { passive: true,
          capture: true }
      );
    }
  }

  /**
   * Disables the drag handle by removing its draggable attribute and cleans up event listeners.
   */
  private disableModuleBindings(): void {
    const dragHandle = this.Editor.Toolbar.nodes.settingsToggler;

    if (dragHandle) {
      dragHandle.removeAttribute('draggable');
    }

    this.clearResources();
  }

  /**
   * Registers drag event listeners for each block in the BlockManager.
   * Iterates over all blocks and attaches listeners for dragover, dragleave, and drop events.
   *
   * @private
   */
  private registerBlockEvents(): void {
    const { UI } = this.Editor;

    const dropTarget = UI.nodes.redactor;

    for (const [eventName, eventHandler] of Object.entries(
      this.dropTargetEvents
    )) {
      this.readOnlyMutableListeners.on(
        dropTarget,
        eventName,
        (event: Event) => {
          if (event instanceof DragEvent) {
            eventHandler(event);
          }
        },
        { passive: true,
          capture: true }
      );
    }
  }

  /**
   * Creates and inserts a drop holder element at the target position.
   * This visual element indicates where the dragged block will be placed.
   *
   * @returns The created drop holder element or null if no drop target is available
   * @private
   */
  private createDropHolder = (): HTMLElement | null => {
    if (!this.dropTargetArgs) {
      return null;
    }

    const { block, position } = this.dropTargetArgs;

    const dropHolder = document.createElement('div');

    dropHolder.classList.add(
      BlockDragNDrop.CSS.dragWrapper,
      BlockDragNDrop.CSS.dropHolder
    );

    block.holder.insertAdjacentElement(
      position === DropPosition.Top ? 'beforebegin' : 'afterend',
      dropHolder
    );

    return dropHolder;
  };

  /**
   * Removes all drop holder elements from the editor.
   * This cleans up visual indicators after a drag operation completes.
   */
  private removeDropHolder(): void {
    this.Editor.UI.nodes.redactor
      .querySelectorAll(
        `.${BlockDragNDrop.CSS.dragWrapper}.${BlockDragNDrop.CSS.dropHolder}`
      )
      .forEach((dropHolder) => {
        dropHolder.remove();
      });
  }

  /**
   * Cleans up the drag and drop state by removing drag images, resetting internal state
   */
  private clearResources(): void {
    this.stopAutoScroll();
    this.removeDragImage();
    this.removeDropHolder();

    this.dragSourceBlockId = null;
    this.dropTargetArgs = null;
    this.scrollContainerCache = null;
  }

  /**
   * clears all event listeners attached to block holders
   */
  private destroy(): void {
    this.hoveredBlock = null;
    this.readOnlyMutableListeners.clearAll();
  }

  /**
   * Creates a visual representation of the block being dragged.
   *
   * @param block - The block being dragged
   * @returns The element representing the dragged block
   * @private
   */
  private createDragImage = (block: Block): HTMLElement => {
    const dragImage = block.holder.cloneNode(true) as HTMLElement;

    dragImage.classList.add(
      BlockDragNDrop.CSS.dragWrapper,
      BlockDragNDrop.CSS.dragImage
    );
    this.Editor.UI.nodes.redactor.appendChild(dragImage);

    return dragImage;
  };

  /**
   * Removes any existing drag image elements from the editor's redactor.
   *
   * @private
   */
  private removeDragImage(): void {
    this.Editor.UI.nodes.redactor
      .querySelectorAll(
        `.${BlockDragNDrop.CSS.dragWrapper}.${BlockDragNDrop.CSS.dragImage}`
      )
      .forEach((dragImage) => {
        dragImage.remove();
      });
  }

  /**
   * optimizes dragover event by checking if the closest block and drop position are the same
   * as the last dragover event.
   * If they are, it returns true to avoid unnecessary processing.
   *
   * @param event - The drag event
   */
  private isDragOverEventSame(event: DragEvent): boolean {
    const dropTargetArgs = this.findDropTarget(event);

    if (dropTargetArgs == null) {
      return false;
    }

    if (
      dropTargetArgs.block === this.dropTargetArgs?.block &&
      dropTargetArgs.position === this.dropTargetArgs?.position
    ) {
      // if the closest blocks are the same, return true
      return true;
    }

    this.dropTargetArgs = dropTargetArgs;

    return false;
  }

  /**
   * Finds the closest blocks above and below the mouse event.
   *
   * @param mouseEvent - The mouse event.
   * @returns An object with the closest top and bottom blocks.
   */
  private findDropTarget = (
    mouseEvent: MouseEvent
  ): { block: Block; position: DropPosition } | null => {
    const { BlockManager } = this.Editor;

    const { clientX, clientY } = mouseEvent;
    const elementAtMouseEvent = document.elementFromPoint(clientX, clientY);

    if (elementAtMouseEvent != null) {
      const closestElement = elementAtMouseEvent.closest(
        `.${Block.CSS.wrapper}`
      );
      const block = BlockManager.blocks.find((_block) => {
        return _block.holder === closestElement;
      });

      if (block) {
        const { top, bottom } = block.holder.getBoundingClientRect();

        return {
          block,
          position:
            clientY < (top + bottom) / 2
              ? DropPosition.Top
              : DropPosition.Bottom,
        };
      }
    }

    return null;
  };

  /**
   * Finds the scrollable parent of an element
   *
   * @param element - The element to find the scrollable parent for
   * @returns The scrollable parent element
   * @private
   */
  private findScrollContainer(element: HTMLElement): HTMLElement {
    if (this.scrollContainerCache) {
      return this.scrollContainerCache;
    }

    // Otherwise find the scrollable parent automatically
    let parent = element.parentElement;

    while (parent) {
      const { overflowY } = window.getComputedStyle(parent);

      if (overflowY === 'auto' || overflowY === 'scroll') {
        this.scrollContainerCache = parent;

        return parent;
      }
      parent = parent.parentElement;
    }

    // If no scrollable parent is found, use document.scrollingElement or body as fallback
    const _scrollContainer = (document.scrollingElement ||
      document.body) as HTMLElement;

    this.scrollContainerCache = _scrollContainer;

    return _scrollContainer;
  }

  /**
   * Gets custom threshold values from the editor holder if specified
   *
   * @returns Object with top and bottom threshold values in pixels
   * @private
   */
  private getScrollThresholds(): {
    top: number;
    bottom: number;
    } {
    // Default thresholds
    const defaults = {
      top: this.DRAG_SCROLL_THRESHOLD,
      bottom: this.DRAG_SCROLL_THRESHOLD,
    };

    const { holder } = this.Editor.UI.nodes;

    // Check for custom thresholds on the editor holder
    const topThresholdAttr = holder.getAttribute(
      this.customDataAttributes.topScrollThreshold
    );
    const bottomThresholdAttr = holder.getAttribute(
      this.customDataAttributes.bottomScrollThreshold
    );

    // Parse with validation
    let top = defaults.top;
    let bottom = defaults.bottom;

    if (topThresholdAttr !== null) {
      const parsedTop = parseInt(topThresholdAttr, 10);

      // Check if the parsed value is a valid number and is positive
      if (!isNaN(parsedTop) && parsedTop >= 0) {
        top = parsedTop;
      }
    }

    if (bottomThresholdAttr !== null) {
      const parsedBottom = parseInt(bottomThresholdAttr, 10);

      // Check if the parsed value is a valid number and is positive
      if (!isNaN(parsedBottom) && parsedBottom >= 0) {
        bottom = parsedBottom;
      }
    }

    return { top,
      bottom };
  }

  /**
   * Handles auto-scrolling when dragging near viewport edges
   *
   * @param clientY - Y coordinate of the drag event
   * @private
   */
  private handleAutoScroll(clientY: number): void {
    // Cancel any existing scroll animation
    if (this.scrollAnimationId !== null) {
      window.cancelAnimationFrame(this.scrollAnimationId);
      this.scrollAnimationId = null;
    }

    const { UI } = this.Editor;
    const holder = UI.nodes.holder;

    // Find the actual scroll container
    const scrollContainer = this.findScrollContainer(holder);

    // Get custom thresholds if specified
    const thresholds = this.getScrollThresholds();

    // Calculate distance from viewport edges
    const distanceFromTop = clientY; // From viewport top
    const distanceFromBottom = window.innerHeight - clientY; // From viewport bottom

    const isNearTopEdge = distanceFromTop < thresholds.top;
    const isNearBottomEdge = distanceFromBottom < thresholds.bottom;
    const isNearEdge = isNearTopEdge || isNearBottomEdge;

    // Determine if we need to scroll
    if (isNearEdge) {
      this.startAutoScroll(
        distanceFromTop,
        distanceFromBottom,
        scrollContainer,
        thresholds
      );
    }
  }

  /**
   * Starts the auto-scroll animation
   *
   * @param distanceFromTop - Distance from viewport top edge
   * @param distanceFromBottom - Distance from viewport bottom edge
   * @param scrollContainer - The container element that should be scrolled
   * @param thresholds - Custom threshold values
   * @private
   */
  private startAutoScroll(
    distanceFromTop: number,
    distanceFromBottom: number,
    scrollContainer: HTMLElement,
    thresholds: { top: number; bottom: number } = {
      top: this.DRAG_SCROLL_THRESHOLD,
      bottom: this.DRAG_SCROLL_THRESHOLD,
    }
  ): void {
    // Animation function for smooth scrolling
    const scroll = (): void => {
      let scrollAmount = 0;

      // Calculate scroll amount and direction based on proximity to viewport edges
      if (distanceFromTop < thresholds.top) {
        // Scrolling up - faster as you get closer to the edge
        const intensity = 1 - distanceFromTop / thresholds.top;

        scrollAmount = -Math.ceil(this.SCROLL_SPEED * intensity);
      } else if (distanceFromBottom < thresholds.bottom) {
        // Scrolling down - faster as you get closer to the edge
        const intensity = 1 - distanceFromBottom / thresholds.bottom;

        scrollAmount = Math.ceil(this.SCROLL_SPEED * intensity);
      }

      if (scrollAmount !== 0) {
        // Apply scrolling to the correct container
        scrollContainer.scrollBy(0, scrollAmount);
        // Continue animation
        this.scrollAnimationId = window.requestAnimationFrame(scroll);
      } else {
        this.scrollAnimationId = null;
      }
    };

    // Start the animation
    this.scrollAnimationId = window.requestAnimationFrame(scroll);
  }

  /**
   * Stops any ongoing auto-scroll animation
   *
   * @private
   */
  private stopAutoScroll(): void {
    if (this.scrollAnimationId !== null) {
      window.cancelAnimationFrame(this.scrollAnimationId);
      this.scrollAnimationId = null;
    }
  }
}
