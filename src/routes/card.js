import { Router } from 'express';
import stripe from '../stripe';

const router = Router();

router.post('/', (req, res) => {
  stripe.customers.create({
    email: req.user.email,
    source: req.body.cardToken,
  })
    .then(({ id }) => req.user.card = id)
    .then(() => req.user.save())
    .then(() => res.json({ message: 'Card has been saved.' }))
    .catch(err => res.status(400).json({ err, message: 'Card could not be saved.' }))
  ;
});

export default router;
