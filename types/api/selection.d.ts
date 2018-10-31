namespace EditorJS.API {
  export interface Selection {
    findParentTag(tagName: string, className?: string): HTMLElement|null;
    expandToTag(node: HTMLElement): void;
  }
}
