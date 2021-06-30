import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt, for saving a user
 * @param password
 */
export async function hashPass(password: string): Promise<string> {
  return await bcrypt.hash(password, await bcrypt.genSalt());
}

/**
 * Compares a password to a previous hash, for logging a user in
 * @param password
 * @param hash
 */
export async function comparePassToHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
