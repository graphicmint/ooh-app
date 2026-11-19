import { AuthUser } from '../types/auth';

const AUTH_STORAGE_KEY = 'blitzdeck_auth_user_v2';
const LEGACY_AUTH_STORAGE_KEY = 'interspace_auth_user_v1';

export function getTodayDateCode(date: Date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

/**
 * Dynamic daily password: integer(DDMMYYYY) / 2
 * Example: 19112026 / 2 = 9556013, 01122026 (1122026) / 2 = 561013
 */
export function getTodayPasscode(date: Date = new Date()): string {
  const dateNum = Number(getTodayDateCode(date));
  return String(Math.floor(dateNum / 2));
}

export function formatNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || '';
  if (localPart.toLowerCase() === 'graphicmint') {
    return 'GraphicMint';
  }
  if (localPart.toLowerCase() === 'ganesh.sagwekar') {
    return 'Ganesh Sagwekar';
  }
  return (
    localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || 'OOH Team Member'
  );
}

export const authService = {
  getCurrentDatePasscode(): string {
    return getTodayPasscode();
  },

  validateCredentials(email: string, password: string): { isValid: boolean; error?: string; user?: AuthUser } {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      return { isValid: false, error: 'Please enter your email address.' };
    }

    if (!trimmedPassword) {
      return { isValid: false, error: 'Please enter your security passkey.' };
    }

    // Dynamic daily passcode: DDMMYYYY / 2 (check both local time and IST)
    const todayPasscode = getTodayPasscode();
    const istDate = new Date(Date.now() + 5.5 * 3600 * 1000);
    const istPasscode = String(
      Math.floor(
        Number(
          `${String(istDate.getUTCDate()).padStart(2, '0')}${String(istDate.getUTCMonth() + 1).padStart(2, '0')}${istDate.getUTCFullYear()}`
        ) / 2
      )
    );
    const validPasscodes = new Set([todayPasscode, istPasscode]);

    const isPasswordCorrect = validPasscodes.has(trimmedPassword);

    if (!isPasswordCorrect) {
      return {
        isValid: false,
        error: `Invalid passkey. Password is today's date (DDMMYYYY) divided by 2.`,
      };
    }

    const name = formatNameFromEmail(trimmedEmail);
    const user: AuthUser = {
      email: trimmedEmail === 'graphicmint@gmail.com' ? 'Graphicmint@gmail.com' : trimmedEmail,
      name,
      role:
        trimmedEmail === 'graphicmint@gmail.com' || trimmedEmail.includes('ganesh')
          ? 'Media Operations & Planner'
          : 'Media Operations Specialist',
      organization: 'BlitzDeck & SiteSync OOH',
      loggedInAt: new Date().toISOString(),
    };

    return { isValid: true, user };
  },

  saveSession(user: AuthUser, remember: boolean = true) {
    if (typeof window === 'undefined') return;
    try {
      const data = JSON.stringify(user);
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, data);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, data);
      }
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
  },

  getStoredSession(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const local = localStorage.getItem(AUTH_STORAGE_KEY);
      if (local) return JSON.parse(local);
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (session) return JSON.parse(session);
    } catch (e) {
      console.error('Failed to load auth session', e);
    }
    return null;
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  },
};
