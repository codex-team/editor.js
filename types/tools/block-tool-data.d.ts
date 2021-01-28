/**
 * Object returned by Tool's {@link BlockTool#save} method
 * Specified by Tool developer, so leave it as object
 */
export type BlockToolData<T extends object = any> = T;

/**
 * Default Block Tool data created by Block splitting and so on
 */
export interface DefaultBlockToolData {
  text: string;
}
