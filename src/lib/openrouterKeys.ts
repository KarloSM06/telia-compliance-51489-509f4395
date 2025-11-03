export interface APIKey {
  hash: string;
  name?: string;
  label?: string;
  [key: string]: any;
}

/**
 * Get the user-defined display name for an API key
 * Priority: name (user-set) > 'Unnamed Key'
 */
export const getKeyDisplayName = (key?: APIKey | null): string => {
  return key?.name?.trim() || 'Unnamed Key';
};

/**
 * Get the masked label (technical identifier) for an API key
 */
export const getKeyMaskedLabel = (key?: APIKey | null): string | null => {
  return key?.label || null;
};

/**
 * Build a resolver to map activity endpoint IDs to display names
 * and ensure unique legend names
 */
export const buildKeyResolver = (keys: APIKey[]) => {
  const maskedMap = new Map<string, string>();
  const exactMap = new Map<string, string>();

  // Build lookup maps
  for (const key of keys) {
    const displayName = getKeyDisplayName(key);
    
    // Map full hash to display name
    if (key.hash) {
      exactMap.set(key.hash, displayName);
    }
    
    // Map label (masked string from OpenRouter) to display name
    if (key.label) {
      maskedMap.set(key.label, displayName);
    }
    
    // Generate common masked formats from hash
    if (key.hash && key.hash.length >= 6) {
      maskedMap.set(`${key.hash.slice(0, 3)}...${key.hash.slice(-3)}`, displayName);
      maskedMap.set(`${key.hash.slice(0, 3)}...${key.hash.slice(-4)}`, displayName);
      maskedMap.set(`${key.hash.slice(0, 8)}...${key.hash.slice(-4)}`, displayName);
    }
  }

  /**
   * Resolve an endpoint ID from activity data to a display name
   */
  const resolve = (endpointId: string | undefined | null): string => {
    if (!endpointId) return 'Unknown';
    
    // Try direct masked match (most common)
    if (maskedMap.has(endpointId)) {
      return maskedMap.get(endpointId)!;
    }
    
    // Try exact hash match
    if (exactMap.has(endpointId)) {
      return exactMap.get(endpointId)!;
    }
    
    // Handle "xxx...yyy" format
    if (endpointId.includes('...')) {
      const [prefix, suffix] = endpointId.split('...');
      const match = keys.find(k => 
        k.hash && 
        k.hash.startsWith(prefix) && 
        k.hash.endsWith(suffix)
      );
      if (match) return getKeyDisplayName(match);
    }
    
    // Fallback: try prefix/suffix matching
    if (endpointId.length >= 8) {
      const prefixLen = Math.min(12, endpointId.length);
      const suffixLen = Math.min(8, endpointId.length);
      const match = keys.find(k => 
        k.hash && (
          k.hash.startsWith(endpointId.slice(0, prefixLen)) ||
          k.hash.endsWith(endpointId.slice(-suffixLen))
        )
      );
      if (match) return getKeyDisplayName(match);
    }
    
    // Last resort: return masked ID
    return `Key ${endpointId.substring(0, 8)}...`;
  };

  /**
   * Ensure unique names by adding masked suffix to duplicates
   */
  const ensureUnique = (names: string[]): string[] => {
    const counts = new Map<string, number>();
    names.forEach(name => counts.set(name, (counts.get(name) || 0) + 1));
    
    // If all names are unique, return as-is
    if ([...counts.values()].every(count => count === 1)) {
      return names;
    }
    
    // Build name -> keys lookup
    const nameToKeys = new Map<string, APIKey[]>();
    for (const key of keys) {
      const name = getKeyDisplayName(key);
      if (!nameToKeys.has(name)) {
        nameToKeys.set(name, []);
      }
      nameToKeys.get(name)!.push(key);
    }
    
    // Add suffixes to duplicates
    const seenCounts = new Map<string, number>();
    return names.map(name => {
      const count = counts.get(name) || 0;
      if (count === 1) return name;
      
      // Get the nth occurrence of this name
      const occurrenceIndex = seenCounts.get(name) || 0;
      seenCounts.set(name, occurrenceIndex + 1);
      
      const keysWithName = nameToKeys.get(name) || [];
      const key = keysWithName[occurrenceIndex];
      
      if (!key) return name;
      
      // Add masked label or hash suffix
      const maskedLabel = getKeyMaskedLabel(key);
      const suffix = maskedLabel 
        ? ` (${maskedLabel.slice(0, 10)}...)` 
        : ` (${key.hash?.slice(0, 6)}...)`;
      
      return `${name}${suffix}`;
    });
  };

  return { resolve, ensureUnique };
};
