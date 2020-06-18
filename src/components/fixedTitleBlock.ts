export default class FixedTitleBlock {
  public static getTitleText(): string {
    /**
     * Getting title text from value prperty of textarea with id fixed-title-block
     */
    const titleText = document.getElementById('fixed-title-block')['value'];        

    /**
     * EditorJS.Sanitizer is not a property
     * There is no other way to sanitize data
     */

    return titleText;       
  }
}