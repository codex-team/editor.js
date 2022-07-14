import { multiply } from '../../utils';

/**
 *
 */
export default class FragmentRange extends Range {
  /**
   *
   * @param range
   * @param clone
   */
  public static from(range: Range, clone = false): FragmentRange {
    let result = range;

    if (clone) {
      result = range.cloneRange();
    }

    Object.setPrototypeOf(result, new FragmentRange());

    return result as FragmentRange;
  }

  /**
   *
   */
  public cloneRange(): FragmentRange {
    return FragmentRange.from(super.cloneRange());
  }

  /**
   *
   * @param range
   */
  public equalsToRange(range: Range): boolean {
    const { s2s, e2e } = this.getBoundaryComparison(range);

    return s2s === 0 && e2e === 0;
  }

  /**
   *
   * @param range
   */
  public includesRange(range: Range): boolean {
    return this.isPointInRange(range.startContainer, range.startOffset) && this.isPointInRange(range.endContainer, range.endOffset);
  }

  /**
   *
   * @param range
   */
  public subtractRange(range: FragmentRange): null | FragmentRange | [FragmentRange, FragmentRange] {
    if (!this.intersectsRange(range)) {
      return this.cloneRange();
    }

    if (this.equalsToRange(range)) {
      return null;
    }

    if (range.includesRange(this)) {
      return range.subtractRange(this);
    }

    if (this.includesRange(range)) {
      const left = this.cloneRange();
      const right = this.cloneRange();

      left.setEnd(range.startContainer, range.startOffset);

      right.setStart(range.endContainer, range.endOffset);

      const { s2s, e2e } = this.getBoundaryComparison(range);

      if (s2s === 0) {
        return right;
      }

      if (e2e === 0) {
        return left;
      }

      return [left, right];
    }

    const result = this.cloneRange();

    if (this.startsBefore(range)) {
      result.setEnd(range.startContainer, range.startOffset);
    } else {
      result.setStart(range.endContainer, range.endOffset);
    }

    return result;
  }

  /**
   *
   * @param range
   */
  public mergeRange(range: FragmentRange): FragmentRange {
    if (!this.intersectsRange(range)) {
      return null;
    }

    if (this.includesRange(range)) {
      return this.cloneRange();
    }

    if (range.includesRange(this)) {
      return range.cloneRange();
    }

    const result = this.cloneRange();

    if (this.startsBefore(range)) {
      result.setEnd(range.endContainer, range.endOffset);
    } else {
      result.setStart(range.startContainer, range.startOffset);
    }

    return result;
  }

  /**
   *
   * @param range
   */
  public intersectsRange(range: Range): boolean {
    const { s2s, s2e, e2s, e2e } = this.getBoundaryComparison(range);

    if (this.equalsToRange(range)) {
      return true;
    }

    if (
      multiply(s2s, s2e) === -1 ||
      multiply(e2s, e2e) === -1 ||
      multiply(s2s, e2s) === -1 ||
      multiply(s2e, e2e) === -1
    ) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param range
   */
  public startsBefore(range: Range): boolean {
    const { s2s } = this.getBoundaryComparison(range);

    return s2s === -1;
  }

  /**
   *
   * @param node
   */
  public includesNode(node: Node): boolean {
    const isText = node.nodeType === Node.TEXT_NODE;

    return this.comparePoint(node, 0) > -1 && this.comparePoint(node, isText ? (node as Text).length : node.childNodes.length) < 1;
  }

  /**
   *
   */
  public getIncludedElements(): HTMLElement[] {
    const walker = document.createTreeWalker(this.commonAncestorContainer, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node: HTMLElement): number => {
        return this.includesNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });

    const elements: HTMLElement[] = [];

    while (walker.nextNode()) {
      elements.push(walker.currentNode as HTMLElement);
    }

    return elements;
  }

  /**
   *
   */
  public unwrap(): void {
    const contents = this.extractContents();

    if (contents.childNodes.length > 1) {
      throw new Error('Range includes more than one top-level element');
    }

    contents.append(...Array.from(contents.firstChild.childNodes));

    contents.firstChild.remove();

    this.insertNode(contents);
  }

  /**
   *
   * @param range
   * @private
   */
  private getBoundaryComparison(range: Range): { s2s: number; s2e: number; e2s: number; e2e: number } {
    const s2s = this.compareBoundaryPoints(Range.START_TO_START, range);
    const s2e = this.compareBoundaryPoints(Range.START_TO_END, range);
    const e2s = this.compareBoundaryPoints(Range.END_TO_START, range);
    const e2e = this.compareBoundaryPoints(Range.END_TO_END, range);

    return {
      s2s,
      s2e,
      e2s,
      e2e,
    };
  }
}
