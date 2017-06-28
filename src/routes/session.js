import { Router } from 'express';
import User from '../models/User';

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

  // get the user
  User.findOne({ email: req.body.email })

    // make sure a user is returned
    .then(user => user ? user : Promise.reject('User not found.'))

    // compare hashes and generate a token
    .then(user => user.authenticate(req.body.password))

    // send token to requester
    .then(token => res.json({ token }))

    // reject if any problems occur.
    .catch(reject)
  ;

  return;
});

export default router;
