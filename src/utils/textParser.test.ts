import { describe, it, expect } from 'vitest';
import { parseImportText } from './textParser';

describe('parseImportText', () => {
  describe('basic functionality', () => {
    it('should return empty categories for empty input', () => {
      expect(parseImportText('')).toEqual({ categories: [] });
      expect(parseImportText('   ')).toEqual({ categories: [] });
      expect(parseImportText('\n\n')).toEqual({ categories: [] });
    });

    it('should parse single category with single household', () => {
      const input = `Family
Smith Family`;
      
      const result = parseImportText(input);
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].categoryName).toBe('Family');
      expect(result.categories[0].households).toHaveLength(1);
      expect(result.categories[0].households[0]).toEqual({
        name: 'Smith Family',
        guestCount: 1
      });
    });

    it('should parse multiple categories with multiple households', () => {
      const input = `Family
Smith Family
Johnson Family

Friends
Alice Cooper
Bob Wilson

Coworkers
Jane Doe`;

      const result = parseImportText(input);
      expect(result.categories).toHaveLength(3);
      
      // Check Family category
      expect(result.categories[0].categoryName).toBe('Family');
      expect(result.categories[0].households).toHaveLength(2);
      expect(result.categories[0].households[0].name).toBe('Smith Family');
      expect(result.categories[0].households[1].name).toBe('Johnson Family');
      
      // Check Friends category
      expect(result.categories[1].categoryName).toBe('Friends');
      expect(result.categories[1].households).toHaveLength(2);
      expect(result.categories[1].households[0].name).toBe('Alice Cooper');
      expect(result.categories[1].households[1].name).toBe('Bob Wilson');
      
      // Check Coworkers category
      expect(result.categories[2].categoryName).toBe('Coworkers');
      expect(result.categories[2].households).toHaveLength(1);
      expect(result.categories[2].households[0].name).toBe('Jane Doe');
    });
  });

  describe('guest count inference', () => {
    it('should default single names to 1 guest', () => {
      const input = `Friends
John Smith
Mary Johnson`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0].guestCount).toBe(1);
      expect(result.categories[0].households[1].guestCount).toBe(1);
    });

    it('should handle +1, +2 patterns correctly', () => {
      const input = `Friends
John Smith +1
Mary Johnson +2
Bob Wilson + 3`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0]).toEqual({
        name: 'John Smith',
        guestCount: 2
      });
      expect(result.categories[0].households[1]).toEqual({
        name: 'Mary Johnson',
        guestCount: 3
      });
      expect(result.categories[0].households[2]).toEqual({
        name: 'Bob Wilson',
        guestCount: 4
      });
    });

    it('should handle & and "and" patterns for couples', () => {
      const input = `Couples
John & Jane Smith
Bob and Alice Wilson`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0]).toEqual({
        name: 'John & Jane Smith',
        guestCount: 2
      });
      expect(result.categories[0].households[1]).toEqual({
        name: 'Bob and Alice Wilson',
        guestCount: 2
      });
    });

    it('should handle comma-separated names', () => {
      const input = `Groups
John, Jane, Bobby
Alice, Bob
Single Person, Two, Three, Four`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0]).toEqual({
        name: 'John, Jane, Bobby',
        guestCount: 3
      });
      expect(result.categories[0].households[1]).toEqual({
        name: 'Alice, Bob',
        guestCount: 2
      });
      expect(result.categories[0].households[2]).toEqual({
        name: 'Single Person, Two, Three, Four',
        guestCount: 4
      });
    });

    it('should handle parentheses notation', () => {
      const input = `Families
Smith Family (4)
Johnson Family (2)
Wilson Family (6)`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0]).toEqual({
        name: 'Smith Family',
        guestCount: 4
      });
      expect(result.categories[0].households[1]).toEqual({
        name: 'Johnson Family',
        guestCount: 2
      });
      expect(result.categories[0].households[2]).toEqual({
        name: 'Wilson Family',
        guestCount: 6
      });
    });

    it('should handle prefix number notation', () => {
      const input = `Families
4 - Smith Family
2 - Johnson Family
6 – Wilson Family`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0]).toEqual({
        name: 'Smith Family',
        guestCount: 4
      });
      expect(result.categories[0].households[1]).toEqual({
        name: 'Johnson Family',
        guestCount: 2
      });
      expect(result.categories[0].households[2]).toEqual({
        name: 'Wilson Family',
        guestCount: 6
      });
    });

    it('should handle "kids/children" patterns with parents', () => {
      const input = `Families
Mom, Dad, 2 kids
Parents with 3 children
Mom, Dad, 1 kid`;

      const result = parseImportText(input);
      expect(result.categories[0].households[0]).toEqual({
        name: 'Mom, Dad, 2 kids',
        guestCount: 4 // 2 parents + 2 kids
      });
      expect(result.categories[0].households[1]).toEqual({
        name: 'Parents with 3 children',
        guestCount: 4 // 1 parent (default) + 3 children
      });
      expect(result.categories[0].households[2]).toEqual({
        name: 'Mom, Dad, 1 kid',
        guestCount: 3 // 2 parents + 1 kid
      });
    });
  });

  describe('edge cases', () => {
    it('should skip empty categories', () => {
      const input = `Category 1

Category 2
Household 1

Category 3`;

      const result = parseImportText(input);
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].categoryName).toBe('Category 2');
      expect(result.categories[0].households[0].name).toBe('Household 1');
    });

    it('should handle mixed guest count patterns', () => {
      const input = `Mixed Patterns
Simple Name
John & Jane
Bob Wilson +2
Smith Family (4)
3 - Johnson Family
Mary, Alice, Bob
Parents with 2 kids`;

      const result = parseImportText(input);
      const households = result.categories[0].households;
      
      expect(households[0]).toEqual({ name: 'Simple Name', guestCount: 1 });
      expect(households[1]).toEqual({ name: 'John & Jane', guestCount: 2 });
      expect(households[2]).toEqual({ name: 'Bob Wilson', guestCount: 3 });
      expect(households[3]).toEqual({ name: 'Smith Family', guestCount: 4 });
      expect(households[4]).toEqual({ name: 'Johnson Family', guestCount: 3 });
      expect(households[5]).toEqual({ name: 'Mary, Alice, Bob', guestCount: 3 });
      expect(households[6]).toEqual({ name: 'Parents with 2 kids', guestCount: 3 });
    });
  });
}); 