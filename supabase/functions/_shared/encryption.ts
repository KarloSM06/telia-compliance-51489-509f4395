/**
 * Encrypts sensitive data using AES-256-GCM
 * @param data - Plain text data to encrypt
 * @returns Base64 encoded encrypted data with IV
 */
export async function encryptData(data: string): Promise<string> {
  const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY not configured');
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Generate a random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Import the key
  const keyBuffer = encoder.encode(encryptionKey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer.slice(0, 32), // Use first 32 bytes for AES-256
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Encrypt the data
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    dataBuffer
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
  // Return base64 encoded
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts data encrypted with encryptData
 * @param encryptedData - Base64 encoded encrypted data
 * @returns Decrypted plain text
 */
export async function decryptData(encryptedData: string): Promise<string> {
  const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY not configured');
  }

  try {
    const encoder = new TextEncoder();
    
    // Decode base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);
    
    // Import the key
    const keyBuffer = encoder.encode(encryptionKey);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer.slice(0, 32),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      encryptedBuffer
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption error:', err);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Decrypts credentials using Supabase RPC function
 * @param supabase - Supabase client
 * @param encryptedData - Encrypted credentials object
 * @returns Decrypted credentials
 */
export async function decryptCredentials(
  supabase: any,
  encryptedData: any
): Promise<any> {
  const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY not configured');
  }

  try {
    const decrypted: any = {};
    
    for (const [key, value] of Object.entries(encryptedData)) {
      if (typeof value === 'string' && value) {
        const { data, error } = await supabase.rpc('decrypt_text', {
          encrypted_data: value,
          key: encryptionKey,
        });

        if (error) {
          console.error(`Failed to decrypt ${key}:`, error);
          throw error;
        }

        decrypted[key] = data;
      } else {
        decrypted[key] = value;
      }
    }

    return decrypted;
  } catch (err) {
    console.error('Credentials decryption error:', err);
    throw new Error('Failed to decrypt credentials');
  }
}
