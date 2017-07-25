import { Router } from 'express';

import stripe from '../stripe';
import { STRIPE_WEBHOOK_SECRET } from '../config';

const router = Router();

router.post('/stripe/webhook', (req, res) => {
  console.log(req.body);
  console.log(typeof req.body);
  console.log(req.headers['stripe-signature']);

  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    STRIPE_WEBHOOK_SECRET,
  );

  console.log(event);

  res.send(200);
});

export default router;
