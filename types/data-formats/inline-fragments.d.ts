export interface InlineFragment {
  range: [number, number];
  tool?: string;
  element: string;
  attributes?: Record<string, string>;
}

export type InlineFragmentsDict = {[key: string]: InlineFragment[] | InlineFragmentsDict | InlineFragmentsDict[]};

