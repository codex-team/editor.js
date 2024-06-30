import BlockTool from '../tools/block';
import { isFunction, isString } from '../utils';

/**
 * Check if tool has valid conversion config for export or import.
 *
 * @param tool - tool to check
 * @param direction - export for tool to merge from, import for tool to merge to
 */
export function isToolConvertable(tool: BlockTool, direction: 'export' | 'import'): boolean {
  if (!tool.conversionConfig) {
    return false;
  }

  const conversionProp = tool.conversionConfig[direction];

  return isFunction(conversionProp) || isString(conversionProp);
}
