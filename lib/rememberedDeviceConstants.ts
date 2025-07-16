// Constants for the remembered device recipe
export const SUPER_SECRET_DATA = {
  // When user has completed full MFA (email + SMS)
  FULL_MFA: "Welcome to the super secret data area. If you inspect your Stytch session on the right (or below, depending on screen width) you will see you have two authentication factors: email and phone. You're only able to view the Super secret area because your session has both of these authentication factors.",
  
  // When user is in a remembered device location (bypassed MFA)
  REMEMBERED_DEVICE: "Welcome to the super secret data area! You're accessing this area because your device was recognized as a trusted device. No additional MFA was required."
}; 