import type { ParsedHousehold } from '../types/bulkImport';

export interface ParsedCategoryBlock {
  category: string;
  households: string[];
}

function extractCategoryName(line: string): string {
  return line.trim();
}

/**
 * Splits bulk import text into category blocks, extracting category names and household lines.
 * Ignores empty lines and trims whitespace.
 */
export function parseBulkImportText(input: string): ParsedCategoryBlock[] {
  const lines = input.split(/\r?\n/).map(line => line.trimEnd());
  const blocks: ParsedCategoryBlock[] = [];
  let currentCategory: string | null = null;
  let currentHouseholds: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      // Blank line: end current block if any
      if (currentCategory) {
        blocks.push({ category: currentCategory, households: currentHouseholds });
        currentCategory = null;
        currentHouseholds = [];
      }
      continue;
    }
    if (!currentCategory) {
      // Start of a new category block
      currentCategory = extractCategoryName(line);
      currentHouseholds = [];
    } else {
      // Household line (may be indented or not)
      currentHouseholds.push(line.trim());
    }
  }
  // Push last block if any
  if (currentCategory) {
    blocks.push({ category: currentCategory, households: currentHouseholds });
  }
  return blocks;
}

function inferGuestCount(line: string): { count: number; needsReview: boolean } {
  const trimmed = line.trim();
  
  // 1. Handle empty/invalid lines
  if (trimmed === '') {
    return { count: 1, needsReview: true };
  }
  
  // 2. Check for explicit +N pattern (highest priority)
  const plusMatch = trimmed.match(/\+\s*(\d+)$/);
  if (plusMatch) {
    const extraGuests = parseInt(plusMatch[1]);
    return { count: 1 + extraGuests, needsReview: false };
  }
  
  // 3. Check for simple & or + between names (no numbers present)
  if (!/\d/.test(trimmed) && /\s+(&|\+)\s+/.test(trimmed)) {
    const segments = trimmed.split(/\s+(&|\+)\s+/).filter(s => s.trim().length > 0 && s !== '&' && s !== '+');
    return { count: segments.length, needsReview: false };
  }
  
  // 4. Check for comma-separated names (conservative, no digits)
  if (!/\d/.test(trimmed) && trimmed.includes(',')) {
    const segments = trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
    return { count: segments.length, needsReview: false };
  }
  
  // 5. Fallback
  return { count: 1, needsReview: false };
}

export function parseHouseholdLine(line: string): ParsedHousehold {
  const { count, needsReview } = inferGuestCount(line);
  
  return {
    parsedName: line.trim(),
    guestCount: count,
    rawInput: line,
    needsReview,
  };
} 