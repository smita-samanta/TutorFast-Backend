import { Router } from 'express';
import stripe from '../stripe';

const router = Router();

router.post('/', (req, res) => {
  try {
    if (!req.user.card)
      stripe.customers.create({
        email: req.user.email,
        source: req.body.cardToken,
      })
        .then(({ id }) => req.user.card = id)
        .then(() => req.user.save())
        .then(() => res.json({ message: 'Card has been saved.', user: req.user }))
        .catch(err => res.status(400).json({ err, message: 'Card could not be saved.' }));
    else
      stripe.customers.update(req.user.card, {
        source: req.body.cardToken,
      })
        .then(() => res.json({ message: 'Card has been updated', user: req.user }))
        .catch(err => res.status(400).json({ err, message: 'Card could not be updated.' }));
  } catch (err) {
    res.status(500).json({ err, message: 'Server error.' });
  }
});

router.delete('/', (req, res) => {
  try {
    if (!req.user.card)
      res.status(400).json({ message: 'User has no card' });
    else
      stripe.customers.del(req.user.card)
        .then(() => req.user.card = '')
        .then(() => req.user.save())
        .then(() => res.json({ message: 'Card was deleted.' }))
        .catch(err => res.status(400).json({ err, message: 'Card could not be deleted.' }))
    ;
  } catch (err) {
    res.status(500).json({ err, message: 'Server error.' });
  }
});


export default router;
