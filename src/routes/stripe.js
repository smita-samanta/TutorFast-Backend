import { Router } from 'express';

import { FRONTEND_URI } from '../config';


const router = Router();

router.get('/pad', (req, res) => {
  req.user.account = req.query.code;

  req.user.save()
    .then(res.redirect(FRONTEND_URI))
    .catch(err => res.status(400).json({ err, message: 'Account id could not be saved.' }))
  ;
});

export default router;
