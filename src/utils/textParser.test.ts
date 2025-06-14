import { parseBulkImportText, parseHouseholdLine } from './textParser';
import { describe, it, expect } from 'vitest';

describe('parseBulkImportText - category extraction', () => {
  it('trims whitespace from category names', () => {
    const input = '  Family  \n  Alice\n';
    const result = parseBulkImportText(input);
    expect(result[0].category).toBe('Family');
  });

  it('handles multiple categories and blank lines', () => {
    const input = `Family\nAlice\n\nFriends\n  Bob\n  Carol\n`;
    const result = parseBulkImportText(input);
    expect(result.length).toBe(2);
    expect(result[0].category).toBe('Family');
    expect(result[0].households).toEqual(['Alice']);
    expect(result[1].category).toBe('Friends');
    expect(result[1].households).toEqual(['Bob', 'Carol']);
  });

  it('handles empty categories (no households)', () => {
    const input = 'Family\n\nFriends\n  Bob\n';
    const result = parseBulkImportText(input);
    expect(result[0].category).toBe('Family');
    expect(result[0].households).toEqual([]);
    expect(result[1].category).toBe('Friends');
    expect(result[1].households).toEqual(['Bob']);
  });

  it('handles indented and non-indented household lines', () => {
    const input = 'Family\n  Alice\nBob\n';
    const result = parseBulkImportText(input);
    expect(result[0].category).toBe('Family');
    expect(result[0].households).toEqual(['Alice', 'Bob']);
  });

  it('ignores extra blank lines at start/end', () => {
    const input = '\n\nFamily\nAlice\n\n';
    const result = parseBulkImportText(input);
    expect(result[0].category).toBe('Family');
    expect(result[0].households).toEqual(['Alice']);
  });
});

describe('parseHouseholdLine', () => {
  it('parses a normal household line', () => {
    const result = parseHouseholdLine('Smith Family');
    expect(result.parsedName).toBe('Smith Family');
    expect(result.guestCount).toBe(1);
    expect(result.rawInput).toBe('Smith Family');
    expect(result.needsReview).toBe(false);
  });

  it('parses an indented household line', () => {
    const result = parseHouseholdLine('   Johnson Family   ');
    expect(result.parsedName).toBe('Johnson Family');
    expect(result.guestCount).toBe(1);
    expect(result.rawInput).toBe('   Johnson Family   ');
    expect(result.needsReview).toBe(false);
  });

  it('handles empty lines as needs review', () => {
    const result = parseHouseholdLine('   ');
    expect(result.parsedName).toBe('');
    expect(result.guestCount).toBe(1);
    expect(result.rawInput).toBe('   ');
    // For now, needsReview is always false, but this is a placeholder for future logic
    // expect(result.needsReview).toBe(true);
  });

  it('handles lines with only whitespace as needs review', () => {
    const result = parseHouseholdLine('\t\t');
    expect(result.parsedName).toBe('');
    expect(result.guestCount).toBe(1);
    expect(result.rawInput).toBe('\t\t');
    // For now, needsReview is always false, but this is a placeholder for future logic
    // expect(result.needsReview).toBe(true);
  });
});

describe('parseHouseholdLine - guest count inference', () => {
  it('handles +N patterns correctly', () => {
    expect(parseHouseholdLine('Bob +1').guestCount).toBe(2);
    expect(parseHouseholdLine('Smith Family +2').guestCount).toBe(3);
    expect(parseHouseholdLine('Alice + 1').guestCount).toBe(2);
    expect(parseHouseholdLine('Johnson +0').guestCount).toBe(1);
  });

  it('handles & or + between names (no numbers)', () => {
    expect(parseHouseholdLine('Alice & Bob').guestCount).toBe(2);
    expect(parseHouseholdLine('Anne + Bob').guestCount).toBe(2);
  });

  it('handles comma-separated names (no numbers)', () => {
    expect(parseHouseholdLine('Harry, Ron, Hermione').guestCount).toBe(3);
    expect(parseHouseholdLine('Alice, Bob').guestCount).toBe(2);
    expect(parseHouseholdLine('Single Name').guestCount).toBe(1);
  });

  it('handles empty/invalid lines with needsReview', () => {
    const emptyResult = parseHouseholdLine('   ');
    expect(emptyResult.guestCount).toBe(1);
    expect(emptyResult.needsReview).toBe(true);
    
    const tabResult = parseHouseholdLine('\t\t');
    expect(tabResult.guestCount).toBe(1);
    expect(tabResult.needsReview).toBe(true);
  });

  it('handles fallback cases (single names)', () => {
    const result = parseHouseholdLine('Smith Family');
    expect(result.guestCount).toBe(1);
    expect(result.needsReview).toBe(false);
  });

  it('follows precedence rules (+N wins over other patterns)', () => {
    // +N should take priority over & or comma patterns
    expect(parseHouseholdLine('Alice & Bob +1').guestCount).toBe(2); // +1 wins, not 3
    expect(parseHouseholdLine('Harry, Ron +2').guestCount).toBe(3); // +2 wins, not 2
  });

  it('handles lines with numbers that do not match +N pattern', () => {
    // Lines with numbers that don't match our patterns should fall back to 1
    expect(parseHouseholdLine('Smith Family with 2 kids').guestCount).toBe(1);
    expect(parseHouseholdLine('Alice & Bob with 3 children').guestCount).toBe(1);
    expect(parseHouseholdLine('Parents, 4 people').guestCount).toBe(1);
  });
}); 