import { Router } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { JWT_SECRET, TOKEN_LIFE } from '../config';
import { pjwt } from '../util';

const router = Router();

router.post('/', (req, res) => {
  const reject =
    err => res.status(400).json({ err });

  if (!req.body) {
    reject('Body required.');
    return;
  }

  if (!req.body.email) {
    reject('Email required.');
    return;
  }

  if (!req.body.password) {
    reject('Password required');
    return;
  }

  let foundUser;

  // get a user
  User.findOne({ email: req.body.email })

    // make sure a user is returned
    .then(user => user ? user : Promise.reject())

    // save user for later
    .then(user => foundUser = user)

    // compare hashes
    .then(user => bcrypt.compare(req.body.password, user.passwordDigest))

    // check if hashes were correct
    .then(match => match ? foundUser : Promise.reject())

    // generate token
    .then(({ _id }) => pjwt.sign({ _id }, JWT_SECRET, TOKEN_LIFE))

    // send token to requester
    .then(token => res.json({ token }))

    // reject if any problems occur.
    .catch(reject)
  ;

  return;
});
