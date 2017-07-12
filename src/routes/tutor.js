import { Router } from 'express';
import { mapOn } from '../util';
import User from '../models/User';

const router = Router();

router.get('/', (req, res) => {
  User.find([
    'zipCode',
    'username',
    'subjects',
  ].reduce(
    mapOn(req.body && req.body.query || {}),
    { isTutor: true }
  ))
    .then(tutors => res.json({ tutors }))
    .catch(err => res.status(400).json({ err }));
});
