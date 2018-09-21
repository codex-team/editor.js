import $ from '../dom';
import _ from '../utils';
import IBlockToolData from '../interfaces/tools/block-tool-data';

declare var Module: any;

interface DropConfig {
  extensions: string;
  mimeTypes: string;
  handler: (file: File) => IBlockToolData;
}

export default class DragNDrop extends Module {
  /**
   * Cache for Tools onDrop configs
   *
   * @private
   */
  private toolsDropConfigs: {[tool: string]: {
    extensions: string[],
    mimeTypes: string[],
    handler: (file: File) => IBlockToolData,
  }} = {};

  /**
   * Bind events and process tools configs
   *
   * @private
   */
  public async prepare(): Promise<void> {
    this.bindEvents();
    await this.processTools();
  }

  /**
   * Add drag events listeners to editor zone
   * @private
   */
  private bindEvents(): void {
    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'drop', this.processDrop, true);

    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragstart', () => this.Editor.InlineToolbar.close());

    /* Prevent default browser behavior to allow drop on non-contenteditable elements */
    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragover', (e) => e.preventDefault(), true);
  }

  /**
   * Get and process tool`s drop configs
   *
   * @private
   */
  private processTools(): void {
    const tools = this.Editor.Tools.blockTools;

    Object.entries(tools).forEach(this.processTool);
  }

  /**
   * Check if onDrop config valid and save it to private property
   *
   * @param {string} name
   * @param {Tool} tool
   */
  private processTool = ([name, tool]): void => {
    const toolDropConfig = tool.onDrop;

    if (!toolDropConfig) {
      return;
    }

    const {handler} = toolDropConfig;
    let {extensions, mimeTypes} = toolDropConfig;

    if (!handler || typeof handler !== 'function') {
      _.log(`Drop handler for «${name}» Tool should be a function.`);
      return;
    }

    if (extensions && !Array.isArray(extensions)) {
      _.log(`«extensions» property of the onDrop config for «${name}» Tool should be an array`);
      extensions = [];
    }

    if (mimeTypes && !Array.isArray(mimeTypes)) {
      _.log(`«mimeTypes» property of the onDrop config for «${name}» Tool should be an array`);
      mimeTypes = [];
    }

    if (mimeTypes) {
      mimeTypes = mimeTypes.filter((type) => {
        if (!_.isValidMimeType(type)) {
          _.log(`MIME type value «${type}» for the «${name}» Tool is not a valid MIME type`, 'warn');
          return false;
        }

        return true;
      });
    }

    this.toolsDropConfigs[name] = {
      extensions: extensions || [],
      mimeTypes: mimeTypes || [],
      handler,
    };
  }

  /**
   * Handle drop event
   *
   * @param {DragEvent} dropEvent
   */
  private processDrop = async (dropEvent: DragEvent): Promise<void> => {
    const {
      BlockManager,
      Paste,
    } = this.Editor;

    dropEvent.preventDefault();

    BlockManager.blocks.forEach((block) => block.dropTarget = false);
    try {
      BlockManager.setCurrentBlockByChildNode(dropEvent.target, 'end');
    } catch (e) {
      BlockManager.setCurrentBlockByChildNode(BlockManager.lastBlock.holder);
    }

    if (!dropEvent.dataTransfer.files.length) {
      const data = dropEvent.dataTransfer.getData('text/html') || dropEvent.dataTransfer.getData('Text');
      const p = $.make('p', null, {innerHTML: data});

      await Paste.processData(p.outerHTML, true);

      document.execCommand('delete');
      return;
    }

    let dataToInsert = [];

    if (dropEvent.dataTransfer.files.length) {
      dataToInsert = await Promise.all(
        Array
          .from(dropEvent.dataTransfer.items)
          .map((item) => this.processDataTransferItem(item)),
      );
      dataToInsert = dataToInsert.filter((data) => !!data);
    }

    dataToInsert.forEach(
      (data, i) => {
        if (i === 0 && BlockManager.currentBlock && BlockManager.currentBlock.isEmpty) {
          BlockManager.replace(data.type, data.data);
          return;
        }

        BlockManager.insert(data.type, data.data);
      },
    );
  }

  /**
   * Handle dropped files
   * @param {DataTransferItem} item
   */
  private processDataTransferItem = async (item: DataTransferItem) => {
    if (item.kind === 'string') {
      return;
    }

    const file = item.getAsFile();
    const extension = _.getFileExtension(file);

    const foundConfig = Object
      .entries(this.toolsDropConfigs)
      .find(([toolName, {mimeTypes, extensions}]) => {
        const [fileType, fileSubtype] = file.type.split('/');

        const foundExt = extensions.find((ext) => ext.toLowerCase() === extension.toLowerCase());
        const foundMimeType = mimeTypes.find((mime) => {
            const [type, subtype] = mime.split('/');

            return type === fileType && (subtype === fileSubtype || subtype === '*');
          });

        return !!foundExt || !!foundMimeType;
      });

    if (!foundConfig) {
      return;
    }

    const [tool, {handler}] = foundConfig;
    return {
      data: await handler(file),
      type: tool,
    };
  }
}
