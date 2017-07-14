import { Router } from 'express';
import User from '../models/User';

const router = Router();

router.get('/', (req, res) => {
  const query = { isTutor: true };
  const reqQuery = req.query;

  if ('maxWage' in reqQuery || 'minWage' in reqQuery) query.rate = {};
  if ('maxWage' in reqQuery) query.rate.$lt = Number(reqQuery.maxWage);
  if ('minWage' in reqQuery) query.rate.$gt = Number(reqQuery.minWage);

  if ('subjects' in reqQuery) query.subjects = { $in: reqQuery.subjects };

  if ('zipCode' in reqQuery) query.zipCode = reqQuery.zipCode;
  if ('username' in reqQuery) query.username = { $regex: reqQuery.username };

  User.find(query)
    .then(tutors => res.json({ tutors }))
    .catch(err => res.status(400).json({ err }));
});

export default router;
