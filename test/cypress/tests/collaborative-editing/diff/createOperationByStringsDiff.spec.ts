import { createOperationByStringsDiff } from '../../../../../src/components/collaborative-editing/diff/createOperationByStringsDiff';
import { OperationType } from '../../../../../src/components/collaborative-editing/diff/types';

describe('getChangesFromString function', () => {
  describe('User inserts symbols', () => {
    it('should create Insert operation when a user inserts symbols at the start of the string', () => {
      const before = 'string';
      const after = 'Changed string';
      const expected = [
        {
          type: OperationType.Insert,
          index: 0,
          data: 'Changed ',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Insert operation when a user inserts symbols inside the string', () => {
      const before = 'string';
      const after = 'stri123ng';
      const expected = [
        {
          type: OperationType.Insert,
          index: 4,
          data: '123',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Insert operation when a user inserts symbols at the end of the string', () => {
      const before = 'string';
      const after = 'string is changed';
      const expected = [
        {
          type: OperationType.Insert,
          index: 6,
          data: ' is changed',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Insert operation when a user inserts symbols inside the empty string', () => {
      const before = '';
      const after = 'String';
      const expected = [
        {
          type: OperationType.Insert,
          index: 0,
          data: 'String',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });
  });

  describe('User removes symbols', () => {
    it('should create Remove operation when a user removes symbols at the start of the string', () => {
      const before = 'string';
      const after = 'ing';
      const expected = [
        {
          type: OperationType.Remove,
          index: 0,
          data: 'str',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Remove operation when a user removes symbols from the center of the string', () => {
      const before = 'String is changed';
      const after = 'String changed';
      const expected = [
        {
          type: OperationType.Remove,
          index: 7,
          data: 'is ',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Remove operation when a user removes symbols at the end of the string', () => {
      const before = 'String is changed';
      const after = 'String is';
      const expected = [
        {
          type: OperationType.Remove,
          index: 9,
          data: ' changed',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Remove operation when a user removes full string', () => {
      const before = 'String';
      const after = '';
      const expected = [
        {
          type: OperationType.Remove,
          index: 0,
          data: 'String',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });
  });

  describe('User replaces symbols', () => {
    it('should create Remove and Insert operations when a user replaces symbols at the start of the string', () => {
      const before = 'string';
      const after = 'aaing';
      const expected = [
        {
          type: OperationType.Remove,
          index: 0,
          data: 'str',
        },
        {
          type: OperationType.Insert,
          index: 0,
          data: 'aa',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Remove and Insert operations when a user replaces symbols from the center of the string', () => {
      const before = 'abcaafd';
      const after = 'abceecfd';
      const expected = [
        {
          type: OperationType.Remove,
          index: 3,
          data: 'aa',
        },
        {
          type: OperationType.Insert,
          index: 3,
          data: 'eec',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Remove and Insert operations when a user replaces symbols at the end of the string', () => {
      const before = 'abcdef';
      const after = 'abcaa';
      const expected = [
        {
          type: OperationType.Remove,
          index: 3,
          data: 'def',
        },
        {
          type: OperationType.Insert,
          index: 3,
          data: 'aa',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });

    it('should create Remove and Insert operations when a user replaces full string', () => {
      const before = 'abcd';
      const after = 'efg';
      const expected = [
        {
          type: OperationType.Remove,
          index: 0,
          data: 'abcd',
        },
        {
          type: OperationType.Insert,
          index: 0,
          data: 'efg',
        },
      ];

      const result = createOperationByStringsDiff(before, after);

      expect(result).deep.equal(expected);
    });
  });
});
