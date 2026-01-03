import type {
  API,
  EditorConfig,
  BaseTool,
  BlockAPI,
  BlockToolConstructorOptions,
  OutputData
} from '../../../../types';
import EditorJS from '../../../../types';

export interface NestedEditorToolConfig {
  editorLibrary: typeof EditorJS,
  editorTools?: EditorConfig["tools"],
  editorTunes?: EditorConfig["tunes"],
}

export interface NestedEditorToolData {
  nestedEditor: OutputData,
}

/**
 * Simplified Header for testing
 */
export class NestedEditorTool implements BaseTool {
  private api: API;
  private readOnly: boolean;
  private block: BlockAPI;

  private config: NestedEditorToolConfig;
  private _data: NestedEditorToolData;

  private nestedEditor?: EditorJS;

  /**
   * This flag tells core that current tool supports the read-only mode
   * @link https://editorjs.io/tools-api#isreadonlysupported
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * With this option, Editor.js won't handle Enter keydowns
   * @link https://editorjs.io/tools-api#enablelinebreaks
   */
  static get enableLineBreaks(): boolean {
    return true;
  }

  /**
   *
   * @param options - constructor options
   */
  constructor({ data, api, config, readOnly, block }: BlockToolConstructorOptions) {
    this.api = api;
    this._data = data;
    this.config = {
      editorLibrary: config.editorLibrary,
      editorTools: config.editorTools || {},
      editorTunes: config.editorTunes || [],
    };
    this.readOnly = readOnly;
    this.block = block;
  }

  /**
   * Return Tool's view
   */
  public render(): HTMLElement {
    const rootNode = document.createElement('div');
    rootNode.classList.add(this.api.styles.block);

    const editorNode = document.createElement('div');
    editorNode.style.border = '1px solid'
    editorNode.style.padding = '12px 20px'
    rootNode.appendChild(editorNode);

    this.nestedEditor = new this.config.editorLibrary({
      holder: editorNode,
      data: this.data.nestedEditor,
      tools: this.config.editorTools,
      tunes: this.config.editorTunes,
      minHeight: 150,
      readOnly: this.readOnly,
      onChange: () => {
        this.block.dispatchChange()
      }
    });

    return rootNode;
  }

  /**
   * Return Tool data
   */
  get data(): NestedEditorToolData {
    return this._data;
  }

  /**
   * Stores all Tool's data
   */
  set data(data: NestedEditorToolData) {
    this._data.nestedEditor = data.nestedEditor || {};
    if (this.nestedEditor) {
      this.nestedEditor.blocks.render(this.data.nestedEditor);
    }
  }

  /**
   * Extracts Block data from the UI
   */
  public async save(): Promise<NestedEditorToolData> {
    let savedData: OutputData = { blocks: [] }
    if (this.nestedEditor) {
      savedData = await this.nestedEditor.save();
    }

    return {
      nestedEditor: savedData
    };
  }
}
