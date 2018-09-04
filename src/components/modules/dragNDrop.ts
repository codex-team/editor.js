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

    /**
     * If drag starts on editor it means drag subject is text selection.
     * We should remove html content and replace it with plain text.
     */
    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'dragstart', (e) => {
      e.dataTransfer.clearData('text/html');
      const plain = e.dataTransfer.getData('text/plain');
      e.dataTransfer.setData('text/plain', this.Editor.Sanitizer.clean(plain));
    }, true);

    this.Editor.Listeners.on(this.Editor.UI.nodes.holder, 'drop', this.processDrop, true);

    /** Prevent default behaviour for dragend event */
    this.Editor.Listeners.on(document, 'dragend', (e) => {
      e.preventDefault();
    }, true);
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
    const {dataTransfer} = dropEvent;
    this.Editor.BlockManager.blocks.forEach((block) => block.dropTarget = false);
    this.Editor.BlockManager.setCurrentBlockByChildNode(dropEvent.target, 'end');

    /** If html content is dropped, use the same process as for paste */
    if (dropEvent.dataTransfer.types.includes('text/html')) {
      dropEvent.preventDefault();
      const data = dropEvent.dataTransfer.getData('text/html');
      const p = $.make('p', null, {innerHTML: data});

      this.Editor.Paste.processData(p.outerHTML, true);
      return;
    }

    let dataToInsert = [];

    if (dropEvent.dataTransfer.files.length) {
      dropEvent.preventDefault();
      dataToInsert = await Promise.all(
        Array
          .from(dataTransfer.items)
          .map((item) => this.processDataTransferItem(item)),
      );
      dataToInsert = dataToInsert.filter((data) => !!data);
    }

    dataToInsert.forEach(
      (data, i) => {
        if (i === 0 && this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.isEmpty) {
          this.Editor.BlockManager.replace(data.type, data.data);
          return;
        }

        this.Editor.BlockManager.insert(data.type, data.data);
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
