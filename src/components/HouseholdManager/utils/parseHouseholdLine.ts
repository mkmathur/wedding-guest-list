// Helper function to parse a single household line
export function parseHouseholdLine(line: string): { name: string; guestCount: number } {
  // Try to match patterns like:
  // "John Smith + 1"
  // "Jane Doe, John Doe, 2 kids"
  // "Smith Family (4)"
  // "Bob Wilson +1"
  // "Just a name 3"

  // Trim the input first
  const trimmedLine = line.trim();
  
  // Try to match "name + number" pattern first (before removing parentheses)
  const plusMatch = trimmedLine.match(/^(.+?)\s*\+\s*(\d+)$/);
  if (plusMatch) {
    return {
      name: plusMatch[1].trim(),
      guestCount: 1 + parseInt(plusMatch[2], 10), // Add 1 for the base guest
    };
  }

  // Try to match "name, name, N kids/kid" pattern (support both singular and plural)
  const kidsMatch = trimmedLine.match(/^(.+?),\s*(\d+)\s*kids?$/i);
  if (kidsMatch) {
    const nameCount = kidsMatch[1].split(',').length;
    return {
      name: kidsMatch[1].trim(),
      guestCount: nameCount + parseInt(kidsMatch[2], 10),
    };
  }

  // Try to match "name (number)" pattern
  const parensMatch = trimmedLine.match(/^(.+?)\s*\((\d+)\)$/);
  if (parensMatch) {
    return {
      name: parensMatch[1].trim(),
      guestCount: parseInt(parensMatch[2], 10),
    };
  }

  // Try to match "name number" pattern
  const numberMatch = trimmedLine.match(/^(.+?)\s+(\d+)$/);
  if (numberMatch) {
    return {
      name: numberMatch[1].trim(),
      guestCount: parseInt(numberMatch[2], 10),
    };
  }

  // If no patterns match, assume it's just a name with 1 guest
  return {
    name: trimmedLine,
    guestCount: 1,
  };
} 