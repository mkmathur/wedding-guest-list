interface ParsedHousehold {
  name: string;
  guestCount: number;
}

interface ParsedCategory {  
  categoryName: string;
  households: ParsedHousehold[];
}

interface ParseResult {
  categories: ParsedCategory[];
}

/**
 * Infers guest count from household name text
 * @param householdText - The raw household text to analyze
 * @returns Object with cleaned name and inferred guest count
 */
function inferGuestCount(householdText: string): { name: string, guestCount: number } {
  const text = householdText.trim();
  let name = text;
  let guestCount = 1; // default
  
  // Handle explicit +1, +2, etc. patterns (with optional spaces)
  const plusPattern = /(.+?)\s*\+\s*(\d+)\s*$/;
  const plusMatch = text.match(plusPattern);
  if (plusMatch) {
    name = plusMatch[1].trim();
    guestCount = 1 + parseInt(plusMatch[2]);
    return { name, guestCount };
  }
  
  // Handle explicit number words and patterns like "Mom, Dad, 2 kids" (check this before comma pattern)
  const numberWordPattern = /(\d+)\s+(kids?|children?|guests?)/i;
  const numberWordMatch = text.match(numberWordPattern);
  if (numberWordMatch) {
    const additionalGuests = parseInt(numberWordMatch[1]);
    // Count adults in the text (look for common adult indicators)
    const adultCount = (text.toLowerCase().includes('mom') ? 1 : 0) + 
                     (text.toLowerCase().includes('dad') ? 1 : 0) +
                     (text.toLowerCase().includes('parent') ? 1 : 0);
    guestCount = Math.max(adultCount, 1) + additionalGuests;
    return { name, guestCount };
  }
  
  // Handle & and "and" patterns (couples)
  if (text.includes(' & ') || text.includes(' and ')) {
    guestCount = 2;
    return { name, guestCount };
  }
  
  // Handle comma-separated names (count the names)
  if (text.includes(',')) {
    const names = text.split(',').map(n => n.trim()).filter(n => n !== '');
    guestCount = names.length;
    return { name, guestCount };
  }
  
  // Handle simple number at the end like "Smith Family (4)"
  const parenthesesPattern = /(.+?)\s*\((\d+)\)\s*$/;
  const parenthesesMatch = text.match(parenthesesPattern);
  if (parenthesesMatch) {
    name = parenthesesMatch[1].trim();
    guestCount = parseInt(parenthesesMatch[2]);
    return { name, guestCount };
  }
  
  // Handle number at the beginning like "4 - Smith Family"
  const prefixNumberPattern = /^(\d+)\s*[-–]\s*(.+)$/;
  const prefixMatch = text.match(prefixNumberPattern);
  if (prefixMatch) {
    guestCount = parseInt(prefixMatch[1]);
    name = prefixMatch[2].trim();
    return { name, guestCount };
  }
  
  // Default case: single name/household = 1 guest
  return { name, guestCount };
}

/**
 * Main parsing function that processes bulk import text
 * @param text - Raw text input from user containing categories and households
 * @returns ParseResult containing structured category and household data
 */
function parseImportText(text: string): ParseResult {
  if (!text || text.trim() === '') {
    return { categories: [] };
  }

  const categories: ParsedCategory[] = [];
  
  // Split text into category blocks (separated by blank lines)
  // Handle various whitespace scenarios more robustly
  const blocks = text
    .split(/\n\s*\n+/)
    .map(block => block.trim())
    .filter(block => block !== '');
  
  for (const block of blocks) {
    // Split each block into lines and clean them up
    const lines = block
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    if (lines.length === 0) continue;
    
    // First line is the category name
    const categoryName = lines[0];
    const households: ParsedHousehold[] = [];
    
    // Remaining lines are households
    for (let i = 1; i < lines.length; i++) {
      const householdLine = lines[i];
      
      // Skip empty lines
      if (householdLine === '') continue;
      
      // Infer guest count from the household text
      const { name, guestCount } = inferGuestCount(householdLine);
      
      households.push({
        name,
        guestCount
      });
    }
    
    // Only add category if it has households
    if (households.length > 0) {
      categories.push({
        categoryName,
        households
      });
    }
  }
  
  return { categories };
}

export type { ParsedHousehold, ParsedCategory, ParseResult };
export { parseImportText }; 