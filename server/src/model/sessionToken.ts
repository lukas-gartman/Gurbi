import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  username: string;
}

const secretKey = 'yourSecretKey';

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:');
    return null;
  }
};