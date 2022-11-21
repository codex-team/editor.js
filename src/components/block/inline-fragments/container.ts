import SelectionUtils from '../../selection';
import { nanoid } from 'nanoid';
import { InlineTool as IInlineTool } from '../../../../types';
import BlockTool from '../../tools/block';
import ToolsCollection from '../../tools/collection';
import InlineTool from '../../tools/inline';
import FragmentRange from './range';

export interface InlineFragmentMeta<T extends any = unknown> {
  id: string;
  tool: string;
  data: T;
}

/**
 *
 */
export default class InlineFragmentsContainer {
  public inlineTools: ToolsCollection<InlineTool>;
  public instances: Map<string, IInlineTool>;

  private ranges: Map<string, FragmentRange> = new Map();
  private meta: Map<string, InlineFragmentMeta> = new Map();
  private element: HTMLElement;

  /**
   *
   * @param tool
   * @param element
   */
  constructor(tool: BlockTool, element: HTMLElement, fragments = []) {
    this.element = element;
    this.inlineTools = tool.inlineTools;
    this.instances = new Map(
      Array
        .from(this.inlineTools)
        .map(([name, inlineTool]) => ([name, inlineTool.create()]))
    );
  }

  /**
   * @param name
   */
  public insert(name: string, initialMeta?: InlineFragmentMeta): void {
    const range = FragmentRange.from(SelectionUtils.range);

    const [parent, {id, data}] = this.insertElement(range, this.instances.get(name), initialMeta);
    const meta: InlineFragmentMeta = {
      id,
      data,
      tool: name,
    };

    this.meta.set(id, meta);

    this.flatten();

    this.merge();

    this.restoreRanges();

    console.log(Array.from(this.ranges.values()).map(r => r.toString()));
  }

  /**
   *
   * @param name
   */
  public isToolActive(name: string): boolean {
    return !!this.activeTools.find(({tool}) => tool === name);
  }

  /**
   *
   */
  public get activeTools(): InlineFragmentMeta[] {
    const range = FragmentRange.from(SelectionUtils.range);

    return Array
      .from(this.ranges)
      .filter(([_, r]) => r.includesRange(range))
      .map(([id]) => this.meta.get(id));
  }

  public save() {
    const ranges = Array.from(this.ranges);

    const getAbsoluteCoord = (container: Node, offset: number) => {
      let absoluteOffset = 0;

      if (container.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < offset; i++) {
          absoluteOffset += container.childNodes[i].textContent.length;
        }
      } else {
        absoluteOffset += offset;
      }

      let node = container;

      // @ts-ignore
      while (!(node.classList && node.classList.contains('ce-block__content'))) {
        // @ts-ignore
        const nodeIndex = Array.from(node.parentNode.childNodes).indexOf(node);

        for (let i = 0; i < nodeIndex; i++) {
          absoluteOffset += node.parentNode.childNodes[i].textContent.length;
        }

        node = node.parentElement;
      }

      return absoluteOffset;
    }

    return ranges.map(([id, range]) => {
      const start = getAbsoluteCoord(range.startContainer, range.startOffset);
      const end = getAbsoluteCoord(range.endContainer, range.endOffset);

      return {
        id,
        range: [start, end],
        meta: this.meta.get(id),
      }
    })
  }

  /**
   *
   * @private
   */
  private restoreRanges(): void {
    const rangeElements = this.getElements();
    const id2elements = new Map<string, Element[]>();

    this.ranges = new Map();

    rangeElements.forEach((element) => {
      if (!element.textContent.length) {
        element.remove();

        return;
      }

      const id = element.dataset.rangeId;

      if (!id2elements.has(id)) {
        id2elements.set(id, []);
      }

      id2elements.get(id).push(element);
    });

    Array
      .from(id2elements)
      .forEach(([id, elements]) => {
        const first = elements.shift();
        const last = elements.pop();

        const range = new Range();

        range.setStartBefore(first);
        range.setEndAfter(last ?? first);

        this.ranges.set(id, FragmentRange.from(range));
      });
  }

  /**
   *
   * @param element
   * @private
   */
  private flatten() {
    const nodes = (Array.from(this.element.children) as HTMLElement[]).filter(n => !!n.dataset.rangeId);

    const flattenNode = (node: HTMLElement) => {
      const childNodes = Array.from(node.childNodes);

      childNodes.forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          flattenNode(child as HTMLElement);
        }
      });

      const flattenedChildNodes = Array.from(node.childNodes);

      if (flattenedChildNodes.length === 1) {
        return;
      }

      flattenedChildNodes.forEach(child => {
        const clone = node.cloneNode();

        clone.appendChild(child);

        node.parentNode.insertBefore(clone, node);
      });

      node.remove();
    }

    nodes.forEach(flattenNode);
  }

  /**
   *
   * @param nodes
   * @private
   */
  private merge(): void {
    const nodes = (Array.from(this.element.children) as HTMLElement[]).filter(n => !!n.dataset.rangeId);

    const mergeNodeInternals = (node: HTMLElement) => {
      const allFragments = Array.from(node.querySelectorAll('*')) as HTMLElement[];

      allFragments.unshift(node);

      const fragmentsMeta = allFragments.map(n => this.metaForNode(n));
      const result = [];
      const nodesToRemove = [];

      fragmentsMeta.forEach(meta => {
        /** @todo data is equal */
        const sameMeta = result.find(m => m.tool === meta.tool);

        if (sameMeta) {
          nodesToRemove.push(meta.id);
          return;
        }

        result.push(meta);
      });

      nodesToRemove.forEach(id => {
        const fragmentToRemove = allFragments.find(n => n.dataset.rangeId === id);

        Array.from(fragmentToRemove.childNodes).forEach(child => {
          fragmentToRemove.parentElement.insertBefore(child, fragmentToRemove);
        });

        fragmentToRemove.remove();
      });

      return node;
    }

    const mergeTwoFragments = (previousFragment: HTMLElement, fragment: HTMLElement) => {
      const previousFragments = Array.from(previousFragment.querySelectorAll('*')) as HTMLElement[];

      previousFragments.unshift(previousFragment);

      const fragments = Array.from(fragment.querySelectorAll('*')) as HTMLElement[];

      fragments.unshift(fragment);

      const previousFragmentsMeta = previousFragments.map(n => this.metaForNode(n));
      const fragmentsMeta = fragments.map(n => this.metaForNode(n));

      /** Special case */
      if (previousFragmentsMeta.length === fragmentsMeta.length && fragmentsMeta.every(meta => {
        /** @todo check if data equals */
        return previousFragmentsMeta.find(m => m.tool === meta.tool);
      })) {
        const deepestNode = previousFragments.at(-1);

        deepestNode.append(fragment.textContent);

        deepestNode.normalize();

        fragment.remove();

        return;
      }

      fragmentsMeta.forEach(meta => {
        /** @todo check if data equals */
        const sameMeta = previousFragmentsMeta.find(m => m.tool === meta.tool);

        if (!sameMeta) {
          return;
        }

        const node = fragments.find(f => f.dataset.rangeId === meta.id)!;

        node.dataset.rangeId = sameMeta.id;
      });
    }

    const firstNode = nodes.shift();

    mergeNodeInternals(firstNode);

    nodes.reduce((previousNode, node) => {
      mergeNodeInternals(node);

      mergeTwoFragments(previousNode, node);

      if (!node.parentNode) {
        return previousNode;
      }

      return node;
    }, firstNode);
  }

  /**
   *
   * @param node
   * @private
   */
  private metaForNode(node: HTMLElement): InlineFragmentMeta {
    const id = node.dataset.rangeId;

    return this.meta.get(id);
  }

  /**
   *
   * @param id
   * @private
   */
  private getElements(id?: string): HTMLElement[] {
    const selector = id ? `[data-range-id="${id}"]` : '[data-range-id]';

    return Array.from(this.element.querySelectorAll<HTMLElement>(selector));
  }

  /**
   *
   * @param range
   * @param tool
   * @private
   */
  private insertElement(range: Range, tool: IInlineTool, initialMeta?: InlineFragmentMeta): [HTMLElement, Omit<InlineFragmentMeta, 'tool'>] {
    const id = nanoid(6);
    const contents = range.extractContents();
    const {element, meta} = tool.apply(contents, initialMeta);

    element.dataset.rangeId = id;

    range.insertNode(element);
    range.setStart(element, 0);
    range.setEnd(element, element.childNodes.length);

    return [element, {
      id,
      data: meta,
    }];
  }
}
