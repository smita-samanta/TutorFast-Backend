import { Router } from 'express';

import stripe from '../stripe';
import { STRIPE_WEBHOOK_SECRET } from '../config';
import User from '../models/User';

const router = Router();

router.post('/stripe/webhook', (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    STRIPE_WEBHOOK_SECRET,
  );

  console.log(event);
  console.log(event.type);

  switch (event.type) {
    case 'account.application.deauthorized':
      User.update({ account: event.account }, { $set: { account: '' } })
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500))
      ;
      break;
    default:
      res.sendStatus(200);
  }
});

export default router;
