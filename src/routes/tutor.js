import { Router } from 'express';
import User from '../models/User';

const router = Router();

router.get('/', (req, res) => {
  const query = { isTutor: true };
  const reqQuery = req.body.query;

  if ('maxWage' in reqQuery || 'minWage' in reqQuery) query.wage = {};
  if ('maxWage' in reqQuery) query.wage.$lt = reqQuery.maxWage;
  if ('minWage' in reqQuery) query.wage.$gt = reqQuery.minWage;

  if ('subjects' in reqQuery) query.subjects = { $in: reqQuery.subjects };

  if ('zipCode' in reqQuery) query.zipCode = reqQuery.zipCode;
  if ('username' in reqQuery) query.username = reqQuery.username;

  User.find(query)
    .then(tutors => res.json({ tutors }))
    .catch(err => res.status(400).json({ err }));
});
