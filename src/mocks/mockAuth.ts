import { MOCK_DELAY } from "../constants/config";
import { RawUser } from "../types";

const delay = (ms: number = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const SEED_RAW_USER: RawUser = {
  id: "usr_001",
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
  phone: "+234 801 234 5678",
  bio: "",
  profile_picture_url: undefined,
  is_verified: true,
};

const SEED_PASSWORD = "secretpassword";

function fakeToken() {
  return `mock_token_${Date.now()}`;
}

export const mockAuth = {
  async login(
    email: string,
    password: string,
  ): Promise<{ user: RawUser; token: string }> {
    await delay();
    const normalized = email.trim().toLowerCase();
    if (
      normalized !== SEED_RAW_USER.email &&
      normalized !== "test@eventra.com"
    ) {
      throw { message: "No account found with that email.", status: 404 };
    }
    if (password !== SEED_PASSWORD && password !== "password123") {
      throw { message: "Incorrect password.", status: 401 };
    }
    return { user: SEED_RAW_USER, token: fakeToken() };
  },

  async signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await delay();
    if (!data.email.includes("@")) {
      throw { message: "Enter a valid email address.", status: 400 };
    }
    return { pendingEmail: data.email };
  },

  async verifyAccount(
    email: string,
    code: string,
  ): Promise<{ user: RawUser; token: string }> {
    await delay();
    if (code.length !== 6) {
      throw {
        message: "Enter the 6-digit code sent to your email.",
        status: 400,
      };
    }
    return { user: { ...SEED_RAW_USER, email }, token: fakeToken() };
  },

  async forgotPassword(email: string) {
    await delay();
    return { sent: true };
  },

  async resetPassword(email: string, newPassword: string) {
    await delay();
    if (newPassword.length < 8) {
      throw { message: "Password must be at least 8 characters.", status: 400 };
    }
    return { success: true };
  },
};
