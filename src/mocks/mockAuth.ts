import { MOCK_DELAY } from '../constants/config';
import { AuthSession, User } from '../types';

const delay = (ms: number = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Seeded test account to match our Figma placeholder data.
const SEED_USER: User = {
  id: 'usr_001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+234 801 234 5678',
  avatarInitials: 'JD',
};

const SEED_PASSWORD = 'secretpassword';

function fakeToken() {
  return `mock_token_${Date.now()}`;
}

export const mockAuth = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay();
    if (
      email.trim().toLowerCase() !== SEED_USER.email &&
      email.trim().toLowerCase() !== 'test@eventra.com'
    ) {
      throw { message: 'No account found with that email.', status: 404 };
    }
    if (password !== SEED_PASSWORD && password !== 'password123') {
      throw { message: 'Incorrect password.', status: 401 };
    }
    return { user: SEED_USER, token: fakeToken() };
  },

  async signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ pendingEmail: string }> {
    await delay();
    if (!data.email.includes('@')) {
      throw { message: 'Enter a valid email address.', status: 400 };
    }
    // Real flow: backend creates an unverified account and emails an OTP.
    return { pendingEmail: data.email };
  },

  async verifyAccount(email: string, code: string): Promise<AuthSession> {
    await delay();
    if (code.length !== 6) {
      throw { message: 'Enter the 6-digit code sent to your email.', status: 400 };
    }
    const newUser: User = { ...SEED_USER, email, avatarInitials: 'JD' };
    return { user: newUser, token: fakeToken() };
  },

  async forgotPassword(email: string): Promise<{ sent: boolean }> {
    await delay();
    return { sent: true };
  },

  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean }> {
    await delay();
    if (newPassword.length < 8) {
      throw { message: 'Password must be at least 8 characters.', status: 400 };
    }
    return { success: true };
  },
};