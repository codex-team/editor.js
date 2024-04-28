import type { API } from "../../../types";
import type { BlockAPI } from "../../../types/api/block";
import { EditorModules } from "../../types-internal/editor-modules";
import Block from "../block";

/**
 * Returns Block instance by passed Block index or Block id
 * @param attribute
 */
export function resolveBlock(attribute: BlockAPI | BlockAPI['id'] | number, editor: EditorModules): Block | undefined {
  if (typeof attribute === 'number') {
    return editor.BlockManager.getBlockByIndex(attribute);
  }

  if (typeof attribute === 'string') {
    return editor.BlockManager.getBlockById(attribute);
  }

  return editor.BlockManager.getBlockById(attribute.id);
}
