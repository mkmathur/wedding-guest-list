// Helper function to parse a single household line
export function parseHouseholdLine(line: string): { name: string; guestCount: number } {
  // Try to match patterns like:
  // "John Smith + 1"
  // "Jane Doe, John Doe, 2 kids"
  // "P, N, and two kids" (kids with "and")
  // "Smith Family (4)"
  // "Bob Wilson +1"
  // "Just a name 3"
  // "Harry, Ginny" (comma-separated names)
  // "Draco, wife and two kids" (descriptive counts)
  // "Abby, mom and dad" (name and name patterns)
  // "mom and dad" (person and person patterns)

  // Trim the input first
  const trimmedLine = line.trim();
  
  // Try to match "name + number" pattern first (before removing parentheses)
  const plusNumberMatch = trimmedLine.match(/^(.+?)\s*\+\s*(\d+)$/);
  if (plusNumberMatch) {
    return {
      name: plusNumberMatch[1].trim(),
      guestCount: 1 + parseInt(plusNumberMatch[2], 10), // Add 1 for the base guest
    };
  }

  // Try to match "name + spouse/name" pattern (e.g., "Neville + wife", "Percy + Audrey")
  const plusPersonMatch = trimmedLine.match(/^(.+?)\s*\+\s*(.+)$/);
  if (plusPersonMatch) {
    const firstName = plusPersonMatch[1].trim();
    const secondPart = plusPersonMatch[2].trim();
    
    // If it's a relationship word, just use the first name
    if (secondPart.match(/^(wife|husband|spouse|partner)$/i)) {
      return {
        name: firstName,
        guestCount: 2,
      };
    }
    
    // Otherwise, combine the names
    return {
      name: `${firstName}, ${secondPart}`,
      guestCount: 2,
    };
  }

  // Try to match "name, name, N kids/kid/children/child" pattern (support both singular and plural)
  // Handle both "P, N, 2 kids" and "P, N, and 2 kids" formats
  // Also handle word numbers like "P, N, and two kids"
  const kidsMatch = trimmedLine.match(/^(.+?),\s*(?:and\s+)?(\w+)\s*(kids?|children?)$/i);
  if (kidsMatch) {
    const namesPart = kidsMatch[1].trim();
    const numberPart = kidsMatch[2];
    
    // Convert word numbers to digits
    const numberMap: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };
    
    let kidCount = 0;
    if (numberMap[numberPart.toLowerCase()]) {
      kidCount = numberMap[numberPart.toLowerCase()];
    } else if (/^\d+$/.test(numberPart)) {
      kidCount = parseInt(numberPart, 10);
    }
    
    // Only return if we successfully parsed a number
    if (kidCount > 0 || numberPart === '0') {
      const nameCount = namesPart.split(',').length;
      return {
        name: namesPart,
        guestCount: nameCount + kidCount,
      };
    }
  }

  // Try to match descriptive guest count patterns like "Draco, wife and two kids" or "Abby, mom and dad"
  const descriptiveMatch = trimmedLine.match(/^([^,]+),\s*(.+)$/);
  if (descriptiveMatch) {
    const name = descriptiveMatch[1].trim();
    const description = descriptiveMatch[2].trim().toLowerCase();
    
    // First, check if it's a simple "person and person" pattern (like "mom and dad", "Dina and son")
    // Exclude patterns that have numbered children (like "wife and two kids")
    if (description.match(/^.+\s+and\s+.+$/) && 
        !description.match(/\d+\s+(child|children|kid|kids)/) &&
        !description.match(/(one|two|three|four|five|six|seven|eight|nine|ten)\s+(child|children|kid|kids)/)) {
      // Split by "and" and count each part as one person
      const parts = description.split(/\s+and\s+/).map(part => part.trim()).filter(part => part.length > 0);
      return {
        name: name,
        guestCount: 1 + parts.length, // 1 for the main name + count of people after "and"
      };
    }
    
    // Handle numbered children patterns like "wife and two kids"
    let count = 1; // Start with 1 for the named person
    
    // Look for "wife" or "husband" or "partner" or "spouse"
    if (description.match(/\b(wife|husband|partner|spouse)\b/)) {
      count += 1;
    }
    
    // Look for numbered children/kids patterns (handle "and two kids" format)
    const childMatch = description.match(/(?:and\s+)?(\w+)\s+(child|children|kid|kids)/i);
    if (childMatch) {
      const numberWord = childMatch[1];
      // Convert word numbers to digits
      const numberMap: Record<string, number> = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
      };
      
      if (numberMap[numberWord]) {
        count += numberMap[numberWord];
      } else if (/^\d+$/.test(numberWord)) {
        count += parseInt(numberWord, 10);
      }
    }
    
    // If we found a descriptive pattern, return it
    if (count > 1) {
      return {
        name,
        guestCount: count,
      };
    }
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

  // Try to match "person and person" patterns without a preceding name (like "mom and dad")
  if (trimmedLine.match(/^.+\s+and\s+.+$/) && !trimmedLine.includes(',')) {
    // Exclude patterns that have numbered children
    if (!trimmedLine.match(/\d+\s+(child|children|kid|kids)/) &&
        !trimmedLine.match(/(one|two|three|four|five|six|seven|eight|nine|ten)\s+(child|children|kid|kids)/)) {
      // Split by "and" and count each part as one person
      const parts = trimmedLine.split(/\s+and\s+/).map(part => part.trim()).filter(part => part.length > 0);
      return {
        name: trimmedLine,
        guestCount: parts.length,
      };
    }
  }

  // Try to match comma-separated names (like "Harry, Ginny")
  // This should come after all other patterns to avoid conflicts
  if (trimmedLine.includes(',')) {
    // Check if this looks like a list of names (not already matched by other patterns)
    const names = trimmedLine.split(',').map(name => name.trim()).filter(name => name.length > 0);
    // Simple check: no numbers and no "kids/children" words
    const allLookLikeNames = names.every(name => 
      !name.match(/\d/) && // No digits
      !name.match(/\b(kids?|children?|and)\b/i) // No kid/children/and words
    );
    
    if (allLookLikeNames && names.length > 1) {
      return {
        name: trimmedLine,
        guestCount: names.length,
      };
    }
  }

  // If no patterns match, assume it's just a name with 1 guest
  return {
    name: trimmedLine,
    guestCount: 1,
  };
} 