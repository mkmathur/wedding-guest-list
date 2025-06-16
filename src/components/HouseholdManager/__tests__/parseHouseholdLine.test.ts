import { describe, it, expect } from 'vitest';
import { parseHouseholdLine } from '../utils/parseHouseholdLine';

describe('parseHouseholdLine', () => {
  describe('Plus pattern matching', () => {
    it('should parse "name + number" pattern correctly', () => {
      const result = parseHouseholdLine('John Smith + 1');
      expect(result).toEqual({
        name: 'John Smith',
        guestCount: 2, // 1 base + 1 additional
      });
    });

    it('should parse "name +number" pattern without spaces', () => {
      const result = parseHouseholdLine('Bob Wilson +1');
      expect(result).toEqual({
        name: 'Bob Wilson',
        guestCount: 2,
      });
    });

    it('should parse "name+ number" pattern with space before plus', () => {
      const result = parseHouseholdLine('Alice Johnson + 3');
      expect(result).toEqual({
        name: 'Alice Johnson',
        guestCount: 4, // 1 base + 3 additional
      });
    });

    it('should handle multiple plus signs in name', () => {
      const result = parseHouseholdLine('Smith + Jones Family + 2');
      expect(result).toEqual({
        name: 'Smith + Jones Family',
        guestCount: 3, // 1 base + 2 additional
      });
    });

    it('should handle zero additional guests', () => {
      const result = parseHouseholdLine('Single Person + 0');
      expect(result).toEqual({
        name: 'Single Person',
        guestCount: 1, // 1 base + 0 additional
      });
    });

    it('should parse "name + spouse" pattern correctly', () => {
      const result = parseHouseholdLine('Neville + wife');
      expect(result).toEqual({
        name: 'Neville',
        guestCount: 2,
      });
    });

    it('should parse "name + name" pattern correctly', () => {
      const result = parseHouseholdLine('Percy + Audrey');
      expect(result).toEqual({
        name: 'Percy, Audrey',
        guestCount: 2,
      });
    });

    it('should handle different relationship words', () => {
      const testCases = [
        { input: 'John + wife', expected: { name: 'John', guestCount: 2 } },
        { input: 'Mary + husband', expected: { name: 'Mary', guestCount: 2 } },
        { input: 'Alex + spouse', expected: { name: 'Alex', guestCount: 2 } },
        { input: 'Sam + partner', expected: { name: 'Sam', guestCount: 2 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle mixed case relationship words', () => {
      const result = parseHouseholdLine('David + WIFE');
      expect(result).toEqual({
        name: 'David',
        guestCount: 2,
      });
    });
  });

  describe('Kids pattern matching', () => {
    it('should parse "name, name, N kids" pattern correctly', () => {
      const result = parseHouseholdLine('Jane Doe, John Doe, 2 kids');
      expect(result).toEqual({
        name: 'Jane Doe, John Doe',
        guestCount: 4, // 2 adults + 2 kids
      });
    });

    it('should parse kids pattern with different case', () => {
      const result = parseHouseholdLine('Mary Smith, Bob Smith, 1 Kids');
      expect(result).toEqual({
        name: 'Mary Smith, Bob Smith',
        guestCount: 3, // 2 adults + 1 kid
      });
    });

    it('should parse "kid" instead of "kids"', () => {
      const result = parseHouseholdLine('Parent One, Parent Two, 1 kid');
      expect(result).toEqual({
        name: 'Parent One, Parent Two',
        guestCount: 3, // 2 adults + 1 kid
      });
    });

    it('should handle single parent with kids', () => {
      const result = parseHouseholdLine('Single Parent, 3 kids');
      expect(result).toEqual({
        name: 'Single Parent',
        guestCount: 4, // 1 adult + 3 kids
      });
    });

    it('should handle multiple names with kids', () => {
      const result = parseHouseholdLine('Parent A, Parent B, Parent C, 2 kids');
      expect(result).toEqual({
        name: 'Parent A, Parent B, Parent C',
        guestCount: 5, // 3 adults + 2 kids
      });
    });

    it('should handle zero kids', () => {
      const result = parseHouseholdLine('Adult One, Adult Two, 0 kids');
      expect(result).toEqual({
        name: 'Adult One, Adult Two',
        guestCount: 2, // 2 adults + 0 kids
      });
    });

    it('should handle "and" before kids count', () => {
      const testCases = [
        { input: 'P, N, and 2 kids', expected: { name: 'P, N', guestCount: 4 } },
        { input: 'Mom, Dad, and two kids', expected: { name: 'Mom, Dad', guestCount: 4 } },
        { input: 'Parent A, Parent B, and 1 kid', expected: { name: 'Parent A, Parent B', guestCount: 3 } },
        { input: 'John, Jane, and three children', expected: { name: 'John, Jane', guestCount: 5 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('Parentheses pattern matching', () => {
    it('should parse "name (number)" pattern correctly', () => {
      const result = parseHouseholdLine('Smith Family (4)');
      expect(result).toEqual({
        name: 'Smith Family',
        guestCount: 4,
      });
    });

    it('should parse with extra spaces around parentheses', () => {
      const result = parseHouseholdLine('Johnson Household  (3)');
      expect(result).toEqual({
        name: 'Johnson Household',
        guestCount: 3,
      });
    });

    it('should parse single guest in parentheses', () => {
      const result = parseHouseholdLine('Individual Guest (1)');
      expect(result).toEqual({
        name: 'Individual Guest',
        guestCount: 1,
      });
    });

    it('should handle parentheses with large numbers', () => {
      const result = parseHouseholdLine('Large Family (12)');
      expect(result).toEqual({
        name: 'Large Family',
        guestCount: 12,
      });
    });
  });

  describe('Number suffix pattern matching', () => {
    it('should parse "name number" pattern correctly', () => {
      const result = parseHouseholdLine('Williams Family 5');
      expect(result).toEqual({
        name: 'Williams Family',
        guestCount: 5,
      });
    });

    it('should parse with multiple spaces before number', () => {
      const result = parseHouseholdLine('Davis Household   3');
      expect(result).toEqual({
        name: 'Davis Household',
        guestCount: 3,
      });
    });

    it('should parse single guest with number suffix', () => {
      const result = parseHouseholdLine('Solo Guest 1');
      expect(result).toEqual({
        name: 'Solo Guest',
        guestCount: 1,
      });
    });
  });

  describe('Default case (name only)', () => {
    it('should parse simple name as single guest', () => {
      const result = parseHouseholdLine('Jane Doe');
      expect(result).toEqual({
        name: 'Jane Doe',
        guestCount: 1,
      });
    });

    it('should handle names with multiple words', () => {
      const result = parseHouseholdLine('Mary Jane Watson Smith');
      expect(result).toEqual({
        name: 'Mary Jane Watson Smith',
        guestCount: 1,
      });
    });

    it('should trim whitespace from name', () => {
      const result = parseHouseholdLine('  Padded Name  ');
      expect(result).toEqual({
        name: 'Padded Name',
        guestCount: 1,
      });
    });

    it('should handle empty string', () => {
      const result = parseHouseholdLine('');
      expect(result).toEqual({
        name: '',
        guestCount: 1,
      });
    });

    it('should handle whitespace-only string', () => {
      const result = parseHouseholdLine('   ');
      expect(result).toEqual({
        name: '',
        guestCount: 1,
      });
    });
  });

  describe('Pattern precedence and edge cases', () => {
    it('should prioritize plus pattern over parentheses when both present', () => {
      // The function should match plus pattern first
      const result = parseHouseholdLine('John Smith (2) + 1');
      expect(result).toEqual({
        name: 'John Smith (2)',
        guestCount: 2, // 1 base + 1 additional (plus pattern takes precedence)
      });
    });

    it('should handle names with numbers that are not guest counts', () => {
      const result = parseHouseholdLine('John Smith III');
      expect(result).toEqual({
        name: 'John Smith III',
        guestCount: 1,
      });
    });

    it('should handle names with "kids" that are not in the pattern', () => {
      const result = parseHouseholdLine('Kids R Us Company');
      expect(result).toEqual({
        name: 'Kids R Us Company',
        guestCount: 1,
      });
    });

    it('should handle complex names with special characters', () => {
      const result = parseHouseholdLine("O'Connor-Smith Family + 2");
      expect(result).toEqual({
        name: "O'Connor-Smith Family",
        guestCount: 3,
      });
    });

    it('should handle names with parentheses that are not guest counts', () => {
      const result = parseHouseholdLine('John (Johnny) Smith');
      expect(result).toEqual({
        name: 'John (Johnny) Smith',
        guestCount: 1,
      });
    });

    it('should handle mixed case in kids pattern', () => {
      const result = parseHouseholdLine('Parent One, Parent Two, 2 KIDS');
      expect(result).toEqual({
        name: 'Parent One, Parent Two',
        guestCount: 4,
      });
    });

    it('should handle trailing spaces in all patterns', () => {
      expect(parseHouseholdLine('John Smith + 1   ')).toEqual({
        name: 'John Smith',
        guestCount: 2,
      });
      
      expect(parseHouseholdLine('Jane Doe, John Doe, 2 kids   ')).toEqual({
        name: 'Jane Doe, John Doe',
        guestCount: 4,
      });
      
      expect(parseHouseholdLine('Smith Family (4)   ')).toEqual({
        name: 'Smith Family',
        guestCount: 4,
      });
      
      expect(parseHouseholdLine('Williams Family 5   ')).toEqual({
        name: 'Williams Family',
        guestCount: 5,
      });
    });
  });

  describe('Real-world examples', () => {
    it('should handle typical wedding guest list entries', () => {
      const testCases = [
        { input: 'Mr. and Mrs. Johnson + 2', expected: { name: 'Mr. and Mrs. Johnson', guestCount: 3 } },
        { input: 'The Smith Family (5)', expected: { name: 'The Smith Family', guestCount: 5 } },
        { input: 'Sarah Connor', expected: { name: 'Sarah Connor', guestCount: 1 } },
        { input: 'Mom, Dad, 3 kids', expected: { name: 'Mom, Dad', guestCount: 5 } },
        { input: 'Uncle Bob +1', expected: { name: 'Uncle Bob', guestCount: 2 } },
        { input: 'Grandparents 2', expected: { name: 'Grandparents', guestCount: 2 } },
        { input: 'Dr. Elizabeth Warren-Johnson + 0', expected: { name: 'Dr. Elizabeth Warren-Johnson', guestCount: 1 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle comma-separated names without explicit counts', () => {
      const testCases = [
        { input: 'Harry, Ginny', expected: { name: 'Harry, Ginny', guestCount: 2 } },
        { input: 'Ron, Hermione, Rose, Hugo', expected: { name: 'Ron, Hermione, Rose, Hugo', guestCount: 4 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle descriptive guest counts', () => {
      const testCases = [
        { input: 'Draco, wife and two kids', expected: { name: 'Draco', guestCount: 4 } },
        { input: 'John, spouse and three children', expected: { name: 'John', guestCount: 5 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle "name and name" patterns', () => {
      const testCases = [
        { input: 'Abby, mom and dad', expected: { name: 'Abby', guestCount: 3 } },
        { input: 'Ellie, Dina and son', expected: { name: 'Ellie', guestCount: 3 } },
        { input: 'tom, maria and baby', expected: { name: 'tom', guestCount: 3 } },
        { input: 'John, wife and brother', expected: { name: 'John', guestCount: 3 } },
        { input: 'Sarah, husband and sister', expected: { name: 'Sarah', guestCount: 3 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle "person and person" patterns without preceding name', () => {
      const testCases = [
        { input: 'mom and dad', expected: { name: 'mom and dad', guestCount: 2 } },
        { input: 'husband and wife', expected: { name: 'husband and wife', guestCount: 2 } },
        { input: 'brother and sister', expected: { name: 'brother and sister', guestCount: 2 } },
        { input: 'Alice and Bob', expected: { name: 'Alice and Bob', guestCount: 2 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHouseholdLine(input);
        expect(result).toEqual(expected);
      });
    });
  });
}); 