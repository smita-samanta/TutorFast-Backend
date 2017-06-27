import jwt from 'jsonwebtoken';
import pify from 'pify';

export const pjwt = pify(jwt);
export { default as mapOn } from './mapOn';
