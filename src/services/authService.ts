import { mapUser } from "../api/mappers";
import { mockAuth } from "../mocks/mockAuth";
import { AuthSession } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const raw = await mockAuth.login(email, password);
    return { user: mapUser(raw.user), token: raw.token };
  },
  async signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return mockAuth.signUp(data);
  },
  async verifyAccount(email: string, code: string): Promise<AuthSession> {
    const raw = await mockAuth.verifyAccount(email, code);
    return { user: mapUser(raw.user), token: raw.token };
  },
  async forgotPassword(email: string) {
    return mockAuth.forgotPassword(email);
  },
  async resetPassword(email: string, newPassword: string) {
    return mockAuth.resetPassword(email, newPassword);
  },
};
