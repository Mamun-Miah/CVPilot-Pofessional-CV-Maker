export interface UserPayload {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  googleId: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
