/**
 * Decodes a base64 string into an ArrayBuffer.
 * This is a pure JavaScript implementation to avoid module resolution issues
 * with external packages like 'base64-arraybuffer' in a monorepo setup.
 *
 * @param base64 The base64 encoded string.
 * @returns The decoded ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // `atob` is a global function in both browser and React Native environments.
  // It decodes a base64 string into a binary string.
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}
