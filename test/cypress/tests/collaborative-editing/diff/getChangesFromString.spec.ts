import {
  getChangesFromString,
  Operation
} from '../../../../../src/components/collaborative-editing/diff/getChangesFromString';

describe('getChangesFromString function', () => {
  describe('Insert operation', () => {
    it('should compute operation when a user inserts symbols at the start of the string', () => {
      const before = 'string';
      const after = 'Changed string';
      const expected = {
        type: Operation.Insert,
        from: 0,
        data: 'Changed ',
        length: 8,
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user inserts symbols in the string', () => {
      const before = 'string';
      const after = 'stri123ng';
      const expected = {
        type: Operation.Insert,
        from: 4,
        data: '123',
        length: 3,
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user inserts symbols at the end of the string', () => {
      const before = 'string';
      const after = 'string is changed';
      const expected = {
        type: Operation.Insert,
        from: 6,
        data: ' is changed',
        length: 11,
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });
  });

  describe('Remove operation', () => {
    it('should compute operation when a user removes symbols at the start of the string', () => {
      const before = 'string';
      const after = 'ing';
      const expected = {
        type: Operation.Remove,
        from: 0,
        data: 'str',
        length: 3,
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user removes symbols from the center of the string', () => {
      const before = 'String is changed';
      const after = 'String changed';
      const expected = {
        type: Operation.Remove,
        from: 7,
        data: 'is ',
        length: 3,
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user removes symbols at the end of the string', () => {
      const before = 'String is changed';
      const after = 'String is';
      const expected = {
        type: Operation.Remove,
        from: 9,
        data: ' changed',
        length: 8,
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });
  });

  describe('Replace operation', () => {
    it('should compute operation when a user replaces symbols at the start of the string', () => {
      const before = 'string';
      const after = 'aaing';
      const expected = {
        type: Operation.Replace,
        from: 0,
        data: {
          before: 'str',
          after: 'aa',
        },
        length: {
          before: 3,
          after: 2,
        },
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user replaces symbols from the center of the string', () => {
      const before = 'abcaafd';
      const after = 'abceecfd';
      const expected = {
        type: Operation.Replace,
        from: 3,
        data: {
          before: 'aa',
          after: 'eec',
        },
        length: {
          before: 2,
          after: 3,
        },
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });

    it('should compute operation when a user replaces symbols at the end of the string', () => {
      const before = 'abcdef';
      const after = 'abcaa';
      const expected = {
        type: Operation.Replace,
        from: 3,
        data: {
          before: 'def',
          after: 'aa',
        },
        length: {
          before: 3,
          after: 2,
        },
      };

      const result = getChangesFromString(before, after);

      expect(result).deep.equal(expected);
    });
  });
});
