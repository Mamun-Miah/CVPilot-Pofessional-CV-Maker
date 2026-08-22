import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID =
      configService.get<string>('GOOGLE_CLIENT_ID') || 'dummy-google-client-id';
    const clientSecret =
      configService.get<string>('GOOGLE_CLIENT_SECRET') ||
      'dummy-google-client-secret';
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:5000/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, photos, displayName } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const fullName = name
      ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
      : displayName || '';
    const avatar = photos && photos.length > 0 ? photos[0].value : null;

    if (!email) {
      done(new Error('No email address provided by Google profile'), undefined);
      return;
    }

    try {
      const user = await this.authService.validateGoogleUser({
        googleId: id,
        email,
        name: fullName || null,
        avatar: avatar || null,
      });
      done(null, user);
    } catch (err) {
      done(err as Error, undefined);
    }
  }
}
