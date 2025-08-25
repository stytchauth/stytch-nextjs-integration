import { sql } from '@vercel/postgres';

export async function addUserDevice(userId: string, visitorFingerprint: string) {
  try {
    await sql`
      INSERT INTO user_devices (user_id, visitor_fingerprint) 
      VALUES (${userId}, ${visitorFingerprint})
      ON CONFLICT (user_id, visitor_fingerprint) DO NOTHING
    `;
    return true;
  } catch (error) {
    console.error('Error adding user device:', error);
    return false;
  }
}

export async function getDeviceOwner(visitorFingerprint: string) {
  try {
    const result = await sql`
      SELECT user_id FROM user_devices 
      WHERE visitor_fingerprint = ${visitorFingerprint}
      LIMIT 1
    `;
    return result.rows.length > 0 ? result.rows[0].user_id : null;
  } catch (error) {
    console.error('Error getting device owner:', error);
    return null;
  }
}

export async function isDeviceAvailable(visitorFingerprint: string) {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM user_devices 
      WHERE visitor_fingerprint = ${visitorFingerprint}
    `;
    return result.rows[0].count === '0';
  } catch (error) {
    console.error('Error checking if device is available:', error);
    return true; // Fail safe - treat as available
  }
}
