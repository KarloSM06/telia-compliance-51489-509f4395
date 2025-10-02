export async function decryptText(encryptedText: string, key: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    
    // Decode from base64
    const encrypted = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    
    // XOR decrypt
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyData[i % keyData.length];
    }
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}
