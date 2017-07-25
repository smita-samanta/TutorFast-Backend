import jwt from 'jsonwebtoken';
import pify from 'pify';
import pipe from './pipe';

export const pjwt = pify(jwt);
export { default as mapOn } from './mapOn';
export { pipe };
export const plog = pipe(console.log);
export { default as screenResponse } from './screenResponse';
