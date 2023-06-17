import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export function createJwtToken(payload) {
  const token = sign(payload, JWT_SECRET, { expiresIn: "3h" });
  return token;
}

export function verifyJwtToken(token, next) {
  try {
    const { userId } = verify(token, JWT_SECRET);
    return userId;
  } catch (err) {
    throw (err);
  }
}