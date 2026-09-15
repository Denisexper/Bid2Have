import { OAuth2Client } from 'google-auth-library';
import { InvalidGoogleTokenError } from '../../domain/errors/InvalidGoogleTokenError';
import { GoogleTokenPayload, GoogleTokenVerifier } from '../../domain/repositories/GoogleTokenVerifier';

export class GoogleAuthTokenVerifier implements GoogleTokenVerifier {
  private readonly client: OAuth2Client;

  constructor(private readonly googleClientId: string) {
    this.client = new OAuth2Client(googleClientId);
  }

  async verify(idToken: string): Promise<GoogleTokenPayload> {
    let ticket;
    try {
      ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
    } catch {
      throw new InvalidGoogleTokenError();
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email || !payload.name) {
      throw new InvalidGoogleTokenError();
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.picture ?? null,
    };
  }
}
