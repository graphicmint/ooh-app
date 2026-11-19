import { AuthUser } from '../types/auth';

const AUTH_STORAGE_KEY = 'interspace_auth_user_v1';

export function getTodayDateCode(date: Date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

export function formatNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || '';
  if (localPart.toLowerCase() === 'ganesh.sagwekar') {
    return 'Ganesh Sagwekar';
  }
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'OOH Team Member';
}

export const authService = {
  getCurrentDatePasscode(): string {
    return getTodayDateCode();
  },

  validateCredentials(email: string, password: string): { isValid: boolean; error?: string; user?: AuthUser } {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      return { isValid: false, error: 'Please enter your corporate email address.' };
    }

    if (!trimmedPassword) {
      return { isValid: false, error: 'Please enter your security passkey.' };
    }

    // Dynamic current date passcode (DDMMYYYY) + fallback explicit '17112026'
    const todayPasscode = getTodayDateCode();
    const utcTodayPasscode = getTodayDateCode(new Date(Date.now() + 5.5 * 3600 * 1000)); // IST
    const validPasscodes = new Set([todayPasscode, utcTodayPasscode, '17112026']);

    const isPasswordCorrect = validPasscodes.has(trimmedPassword);

    if (!isPasswordCorrect) {
      return {
        isValid: false,
        error: `Invalid passkey. Password is today's date in DDMMYYYY format (e.g. ${todayPasscode}).`,
      };
    }

    // Allow ganesh.sagwekar@interspaceindia.co.in or any @interspaceindia.co.in / valid corporate email
    const name = formatNameFromEmail(trimmedEmail);
    const user: AuthUser = {
      email: trimmedEmail,
      name,
      role: trimmedEmail.includes('ganesh') ? 'Senior Media Operations & Planner' : 'Media Operations Specialist',
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
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  },
};
