const PROFILE_PHOTO_PREFIX = "papufy_profile_photo_";

export function getProfilePhotoUrl(userId?: string | null): string | null {
  if (!userId) return null;
  try {
    return localStorage.getItem(`${PROFILE_PHOTO_PREFIX}${userId}`);
  } catch {
    return null;
  }
}

export function setProfilePhotoUrl(userId: string, photoUrl: string): void {
  try {
    localStorage.setItem(`${PROFILE_PHOTO_PREFIX}${userId}`, photoUrl);
  } catch {
    // ignore storage quota errors
  }
}

export function removeProfilePhotoUrl(userId: string): void {
  try {
    localStorage.removeItem(`${PROFILE_PHOTO_PREFIX}${userId}`);
  } catch {
    // ignore
  }
}
