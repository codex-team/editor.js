/**
 * Describes InlineToolbar API methods
 */
export interface InlineToolbar {
    /**
     * Closes InlineToolbar
     */
    close(): void;

    /**
     * Opens InlineToolbar
     */
    open(): void;

    bind(element, tools): void;
}
