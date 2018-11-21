/**
 * Allow to import .svg from components/modules/ui from TypeScript file
 */
declare module '*.svg' {
  const content: string;
  export default content;
}
