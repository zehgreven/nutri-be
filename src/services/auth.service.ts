import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';

export interface JwtToken {
  sub: string;
}

export interface AppToken {
  token: string;
  'refresh-token': string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPasword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPasword);
  }

  public static generateToken(sub: string): AppToken {
    return {
      token: jwt.sign({ sub }, config.get('auth.key'), {
        expiresIn: Number.parseInt(config.get('auth.tokenExpiresIn'), 10),
      }),
      'refresh-token': jwt.sign({ sub }, config.get('auth.key'), {
        expiresIn: Number.parseInt(
          config.get('auth.refreshTokenExpiresIn'),
          10,
        ),
      }),
    };
  }

  public static async refreshToken(token: string): Promise<AppToken | Error> {
    if (!token) {
      throw new Error('Token is empty');
    }

    const decoded = await this.decodeToken(token);

    if (!decoded.sub) {
      throw new Error('Token is invalid');
    }

    return this.generateToken(decoded.sub);
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, config.get('auth.key')) as JwtToken;
  }
}
