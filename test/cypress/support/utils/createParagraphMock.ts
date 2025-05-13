import { nanoid } from 'nanoid';

/**
 * Creates a paragraph mock
 *
 * @param text - text for the paragraph
 * @returns paragraph mock
 */
export function createParagraphMock(text: string): {
  id: string;
  type: string;
  data: { text: string };
} {
  return {
    id: nanoid(),
    type: 'paragraph',
    data: { text },
  };
}