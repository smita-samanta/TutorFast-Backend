
import User from '../models/User';
import { pjwt } from '../util';
import { JWT_SECRET } from '../config';

export default (req, res, next) => {

  if (isWhitelistedRequest(req)) {
    next();
    return;
  }

  const token = req.headers.authorization;

  // reject if no token
  if (!token) {
    res.status(401).json({ err: 'Auth required.' });
    return;
  }

  pjwt
    // verifty the server signed the token
    .verify(token, JWT_SECRET)

    // get the user with the use id from the db
    .then(({ _id }) => User.findOne({ _id }))

    // if no user was found reject
    .then(user => user ? user : Promise.reject())

    // hange user at req.user for use downstream
    .then(user => req.user = user)

    // handoff execution to the next part of the pipeline
    .then(() => next())

    // if something goes wrong reject the req.
    .catch(_ => res.status(401).json({ err: 'Auth required.' }))
  ;

  return;
};

function isWhitelistedRequest(req) {
  if (isPreflight(req)) return true;
  if (isLoggingInOrSigningUp(req)) return true;

  return false;
}

function isLoggingInOrSigningUp(req) {
  if (req.method.toLowerCase() !== 'post') return false;

  const loggingIn = req.originalUrl.includes('session');
  const signingUp = req.originalUrl.includes('user');

  return loggingIn || signingUp;
}

function isPreflight(req) {
  return req.method.toLowerCase() === 'options';
}
