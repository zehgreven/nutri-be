import bcrypt from 'bcrypt';
import AuthService from '../auth.service';

describe('AuthService', () => {
  it('should hash passwords', async () => {
    const password = 'password';
    const hashedPasword = await AuthService.hashPassword(password);

    const comparison = await bcrypt.compare(password, hashedPasword);

    expect(comparison).toBeTruthy();
  });

  it('should be able to compare passwords', async () => {
    const password = 'password';
    const hashedPasword = await bcrypt.hash(password, 10);

    const comparison = await AuthService.comparePasswords(
      password,
      hashedPasword,
    );

    expect(comparison).toBeTruthy();
  });

  it('should generate token', () => {
    const auth = AuthService.generateToken('userId');

    expect(auth).toEqual({
      token: expect.any(String),
      'refresh-token': expect.any(String),
    });
  });

  it('should throw error when there is no refrehs token', async () => {
    expect.assertions(2);

    try {
      await AuthService.refreshToken('');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Token is empty');
    }
  });

  it('should throw error when refresh token is invalid', async () => {
    expect.assertions(2);

    try {
      const auth = AuthService.generateToken('');
      await AuthService.refreshToken(auth['refresh-token']);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Token is invalid');
    }
  });

  it('should throw error when refresh token is invalid', async () => {
    const auth = AuthService.generateToken('userId');
    const refresh = await AuthService.refreshToken(auth['refresh-token']);

    expect(refresh).toStrictEqual({
      token: expect.any(String),
      'refresh-token': expect.any(String),
    });
  });
});
