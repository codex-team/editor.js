/**
 * Abstract interface of all Tools
 */
export default interface ITool {

  /**
   * Should this tools be displayed at the Editor's Toolbox
   */
  displayInToolbox?: boolean;

  /**
   * Class for the Toolbox icon
   */
  iconClassName?: string;

  /**
   * Disable ability to replace empty Block by Toolbox
   */
  irreplaceable?: boolean;

  /**
   * Define Tool type as Inline
   */
  isInline?: boolean;

  /**
   * String with an icon for Toolbox
   */
  toolboxIcon?: string;
}
