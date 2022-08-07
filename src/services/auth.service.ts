import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

export interface JwtToken {
  sub: string;
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

  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, config.get('auth.key'), {
      expiresIn: config.get('auth.tokenExpiresIn'),
    });
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, config.get('auth.key')) as JwtToken;
  }
}
