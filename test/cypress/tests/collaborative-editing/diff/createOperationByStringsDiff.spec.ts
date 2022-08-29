import {
  createOperationByStringsDiff,
  OperationType
} from '../../../../../src/components/collaborative-editing/diff/createOperationByStringsDiff';

describe('getChangesFromString function', () => {
  describe('Insert operation', () => {
    it('should compute operation when a user inserts symbols at the start of the string', () => {
      const before = 'string';
      const after = 'Changed string';
      const expected = [
        {
          type: OperationType.Insert,
          from: 0,
          data: 'Changed ',
          length: 8,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user inserts symbols in the string', () => {
      const before = 'string';
      const after = 'stri123ng';
      const expected = [
        {
          type: OperationType.Insert,
          from: 4,
          data: '123',
          length: 3,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user inserts symbols at the end of the string', () => {
      const before = 'string';
      const after = 'string is changed';
      const expected = [
        {
          type: OperationType.Insert,
          from: 6,
          data: ' is changed',
          length: 11,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user inserts symbols in the empty string', () => {
      const before = '';
      const after = 'String';
      const expected = [
        {
          type: OperationType.Insert,
          from: 0,
          data: 'String',
          length: 6,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });
  });

  describe('Remove operation', () => {
    it('should compute operation when a user removes symbols at the start of the string', () => {
      const before = 'string';
      const after = 'ing';
      const expected = [
        {
          type: OperationType.Remove,
          from: 0,
          data: 'str',
          length: 3,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user removes symbols from the center of the string', () => {
      const before = 'String is changed';
      const after = 'String changed';
      const expected = [
        {
          type: OperationType.Remove,
          from: 7,
          data: 'is ',
          length: 3,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user removes symbols at the end of the string', () => {
      const before = 'String is changed';
      const after = 'String is';
      const expected = [
        {
          type: OperationType.Remove,
          from: 9,
          data: ' changed',
          length: 8,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user removes full string', () => {
      const before = 'String';
      const after = '';
      const expected = [
        {
          type: OperationType.Remove,
          from: 0,
          data: 'String',
          length: 6,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });
  });

  describe('Remove and Insert operations', () => {
    it('should compute operations when a user replaces symbols at the start of the string', () => {
      const before = 'string';
      const after = 'aaing';
      const expected = [
        {
          type: OperationType.Remove,
          from: 0,
          data: 'str',
          length: 3,
        },
        {
          type: OperationType.Insert,
          from: 0,
          data: 'aa',
          length: 2,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operations when a user replaces symbols from the center of the string', () => {
      const before = 'abcaafd';
      const after = 'abceecfd';
      const expected = [
        {
          type: OperationType.Remove,
          from: 3,
          data: 'aa',
          length: 2,
        },
        {
          type: OperationType.Insert,
          from: 3,
          data: 'eec',
          length: 3,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operations when a user replaces symbols at the end of the string', () => {
      const before = 'abcdef';
      const after = 'abcaa';
      const expected = [
        {
          type: OperationType.Remove,
          from: 3,
          data: 'def',
          length: 3,
        },
        {
          type: OperationType.Insert,
          from: 3,
          data: 'aa',
          length: 2,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operations when a user replaces full string', () => {
      const before = 'abcd';
      const after = 'efg';
      const expected = [
        {
          type: OperationType.Remove,
          from: 0,
          data: 'abcd',
          length: 4,
        },
        {
          type: OperationType.Insert,
          from: 0,
          data: 'efg',
          length: 3,
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });
  });
});
