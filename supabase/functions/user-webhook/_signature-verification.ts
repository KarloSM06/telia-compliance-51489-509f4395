/**
 * Twilio Signature Verification
 * https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
export async function verifyTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, any>,
  authToken: string
): Promise<boolean> {
  try {
    // Construct data string from URL + sorted params
    const data = Object.keys(params)
      .sort()
      .reduce((acc, key) => acc + key + params[key], url);

    // Create HMAC-SHA1 signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(authToken);
    const dataToSign = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = btoa(String.fromCharCode(...signatureArray));

    return signature === expectedSignature;
  } catch (error) {
    console.error('[Twilio Signature] Verification error:', error);
    return false;
  }
}

/**
 * Telnyx Signature Verification (Ed25519)
 * https://developers.telnyx.com/docs/v2/development/verifying-webhooks
 */
export async function verifyTelnyxSignature(
  signature: string,
  timestamp: string,
  body: string,
  publicKeyPem: string
): Promise<boolean> {
  try {
    // Construct signed payload
    const signedPayload = `${timestamp}.${body}`;

    // Convert PEM to raw public key
    const publicKeyBase64 = publicKeyPem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '');

    const publicKeyBytes = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));

    // Import Ed25519 public key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes.slice(-32), // Last 32 bytes are the actual Ed25519 key
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      false,
      ['verify']
    );

    // Decode signature from hex
    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    // Verify signature
    const encoder = new TextEncoder();
    const dataToVerify = encoder.encode(signedPayload);

    const isValid = await crypto.subtle.verify(
      'Ed25519',
      cryptoKey,
      signatureBytes,
      dataToVerify
    );

    return isValid;
  } catch (error) {
    console.error('[Telnyx Signature] Verification error:', error);
    return false;
  }
}

/**
 * Vapi Signature Verification
 * (Implementation depends on Vapi's webhook security docs)
 */
export async function verifyVapiSignature(
  signature: string,
  body: string,
  webhookSecret: string
): Promise<boolean> {
  try {
    // Placeholder - implement according to Vapi docs
    // Typically HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSecret);
    const dataToSign = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return signature === expectedSignature;
  } catch (error) {
    console.error('[Vapi Signature] Verification error:', error);
    return false;
  }
}

/**
 * Retell Signature Verification
 * (Implementation depends on Retell's webhook security docs)
 */
export async function verifyRetellSignature(
  signature: string,
  body: string,
  webhookKey: string
): Promise<boolean> {
  try {
    // Placeholder - implement according to Retell docs
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookKey);
    const dataToSign = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return signature === expectedSignature;
  } catch (error) {
    console.error('[Retell Signature] Verification error:', error);
    return false;
  }
}
