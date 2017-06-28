import { Router } from 'express';
import { mapOn } from '../util';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-as-promised';

const router = Router();

router.post('/', (req, res) => {
  if (!req.body.password) {
    res.status(422).json({ err: 'Password must be present.' });
    return;
  }

  const userObj = {};
  let newUser;

  [
    'email',
    'username',
  ].forEach(mapOn(userObj)(req.body));

  // hash the user password for storage
  bcrypt.hash(req.body.password, 10)

    // create a user model object
    .then(
      passwordDigest =>
        newUser = new User({
          ...userObj,
          passwordDigest,
        })
    )

    // save the object to the db
    .then(user => user.save())

    // create a jwt for the new user
    .then(
      ({ _id }) =>
        jwt.sign(
          { _id },
          process.env.JWT_SECRET,
          { expiresIn: 60 * 60 * 24 },
        )
    )

    // send the token and user data back to the
    // new user
    .then(token => res.json({ token, user: newUser }))

    // if anything goes wrong send the error back
    // to the user
    .catch(err => res.status(400).json({ err }))
  ;
});

export default router;
