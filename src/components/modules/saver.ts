/**
 * Editor.js Saver
 *
 * @module Saver
 * @author Codex Team
 * @version 2.0.0
 */
import Module from '../__module';
import { OutputData } from '../../../types';
import { InlineFragment, InlineFragmentsDict, SavedData, ValidatedData } from '../../../types/data-formats';
import Block from '../block';
import * as _ from '../utils';
import $ from '../dom';
import { deepSanitize, sanitizeBlocks } from '../utils/sanitizer';

declare const VERSION: string;

/**
 * @classdesc This method reduces all Blocks asyncronically and calls Block's save method to extract data
 *
 * @typedef {Saver} Saver
 * @property {Element} html - Editor HTML content
 * @property {string} json - Editor JSON output
 */
export default class Saver extends Module {
  /**
   * Composes new chain of Promises to fire them alternatelly
   *
   * @returns {OutputData}
   */
  public async save(): Promise<OutputData> {
    const { BlockManager, Tools, ModificationsObserver } = this.Editor;
    const blocks = BlockManager.blocks,
        chainData = [];

    try {
      /**
       * Disable onChange callback on save to not to spam those events
       */
      ModificationsObserver.disable();

      blocks.forEach((block: Block) => {
        chainData.push(this.getSavedData(block));
      });

      const extractedData = await Promise.all(chainData) as Array<Pick<SavedData, 'data' | 'tool'>>;
      const sanitizedData = sanitizeBlocks(extractedData, (name) => {
        return Tools.blockTools.get(name).sanitizeConfig;
      });
      const withFragments = sanitizedData.map(savedData => {
        if (savedData.tool === this.Editor.Tools.stubTool) {
          return savedData;
        }

        const fragments = this.extractInlineFragments(savedData.data);

        savedData.data = deepSanitize(savedData.data, {});

        return {
          ...savedData,
          fragments,
        };
      });

      return this.makeOutput(withFragments);
    } catch (e) {
      _.logLabeled(`Saving failed due to the Error %o`, 'error', e);
    } finally {
      ModificationsObserver.enable();
    }
  }

  /**
   * Saves and validates
   *
   * @param {Block} block - Editor's Tool
   * @returns {ValidatedData} - Tool's validated data
   */
  private async getSavedData(block: Block): Promise<ValidatedData> {
    const blockData = await block.save();
    const isValid = blockData && await block.validate(blockData.data);

    return {
      ...blockData,
      isValid,
    };
  }

  /**
   * Creates output object with saved data, time and version of editor
   *
   * @param {ValidatedData} allExtractedData - data extracted from Blocks
   * @returns {OutputData}
   */
  private makeOutput(allExtractedData): OutputData {
    let totalTime = 0;
    const blocks = [];

    _.log('[Editor.js saving]:', 'groupCollapsed');

    allExtractedData.forEach(({ id, tool, data, tunes, fragments, time, isValid }) => {
      totalTime += time;

      /**
       * Capitalize Tool name
       */
      _.log(`${tool.charAt(0).toUpperCase() + tool.slice(1)}`, 'group');

      if (isValid) {
        /** Group process info */
        _.log(data);
        _.log(undefined, 'groupEnd');
      } else {
        _.log(`Block «${tool}» skipped because saved data is invalid`);
        _.log(undefined, 'groupEnd');

        return;
      }

      /** If it was stub Block, get original data */
      if (tool === this.Editor.Tools.stubTool) {
        blocks.push(data);

        return;
      }

      const output = {
        id,
        type: tool,
        data,
        ...!_.isEmpty(tunes) && {
          tunes,
        },
        ...!_.isEmpty(fragments) && {
          fragments,
        },
      };

      blocks.push(output);
    });

    _.log('Total', 'log', totalTime);
    _.log(undefined, 'groupEnd');

    return {
      time: +new Date(),
      blocks,
      version: VERSION,
    };
  }

  /**
   *
   * @param data
   * @private
   */
  private extractInlineFragments(data: Pick<SavedData, 'data'>): InlineFragmentsDict {
    const extractFromString = (str: string): InlineFragment[] => {
      const template = $.make('template') as HTMLTemplateElement;

      template.innerHTML = str;

      const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

      let node: Node | null;
      let offset = 0;
      const fragments: InlineFragment[] = [];

      while ((node = walker.nextNode()) !== null) {
        switch (node.nodeType) {
          case Node.TEXT_NODE:
            offset += node.textContent.length;
            break;
          case Node.ELEMENT_NODE: {
            const length = node.textContent.length;
            const fragment: InlineFragment = {
              range: [offset, offset + length],
              element: node.nodeName,
              attributes: Object.fromEntries(Array.from((node as HTMLElement).attributes).map(attr => ([attr.nodeName, attr.nodeValue]))),
            };

            fragments.push(fragment);

            break;
          }
        }
      }

      return fragments;
    };

    const extract = (obj: Record<string, unknown>): InlineFragmentsDict => {
      const result: InlineFragmentsDict = {};

      Object
        .entries(obj)
        .forEach(([key, value]) => {
          if (Array.isArray(value)) {
            const fragments = value.map(v => extract(v)).filter(fragment => Object.keys(fragment).length > 0);

            if (fragments.length > 0) {
              result[key] = fragments;
            }

            return;
          }

          if (typeof value === 'object') {
            const fragments = extract(obj);

            if (Object.keys(fragments).length > 0) {
              result[key] = fragments;
            }

            return;
          }

          if (typeof value === 'string') {
            const fragments = extractFromString(value);

            if (fragments.length > 0) {
              result[key] = fragments;
            }
          }
        });

      return result;
    };

    return extract(data);
  }
}
