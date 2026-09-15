export interface GoogleTokenPayload {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface GoogleTokenVerifier {
  verify(idToken: string): Promise<GoogleTokenPayload>;
}
