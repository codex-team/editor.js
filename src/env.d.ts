interface ImportMetaEnv {
  /**
   * Build environment.
   * For example, used to detect building for tests and add "data-cy" attributes for DOM querying.
   */
  readonly MODE: "test" | "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
