import { Router } from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

import {
  FRONTEND_URI,
  STRIPE_CLIENT_SECRET,
  STRIPE_CLIENT_ID,
  STRIPE_WEBHOOK_SECRET,
} from '../config';
import { screenResponse } from '../util';
import stripe from '../stripe';


const router = Router();

router.post('/webhook',
  (req, res, next) => { req._body = false; next(); },
  bodyParser.raw({ type: '*/*' }),
  (req, res) => {
    console.log(req.body);
    console.log(req.headers['stripe-signature']);

    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      STRIPE_WEBHOOK_SECRET,
    );

    console.log(event);

    res.send(200);
  }
);

router.get('/pad', (req, res) => {
  try {
    fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: STRIPE_CLIENT_ID,
      }),
      headers: {
        authorization: `Bearer ${STRIPE_CLIENT_SECRET}`,
        'content-type': 'application/json',
      },
    })
      .then(screenResponse)
      .then(resp => resp.json())
      .then(({ stripe_user_id }) => req.user.account = stripe_user_id)
      .then(() => req.user.save())
      .then(res.redirect(FRONTEND_URI))
      .catch(err => res.status(400).json({ err, message: 'Account id could not be saved.' }))
    ;
  } catch (err) {
    res.status(500).json({ err, message: 'Server-side error.' });
  }
});

export default router;

router.delete('/account', (req, res) => {
  try {
    fetch('https://connect.stripe.com/oauth/deauthorize', {
      method: 'POST',
      body: JSON.stringify({
        client_id: STRIPE_CLIENT_ID,
        stripe_user_id: req.user.account,
      }),
      headers: {
        authorization: `Bearer ${STRIPE_CLIENT_SECRET}`,
        'content-type': 'application/json',
      },
    })
      .then(screenResponse)
      .then(resp => resp.json())
      .then(() => req.user.account = '')
      .then(() => req.user.save())
      .then(user => res.json({ user, message: 'Stripe token was deauthenticated.' }))
      .catch(err => res.status(400).json({
        err,
        message: 'Stripe token could not be deauthenticated.',
      }))
    ;
  } catch (err) {
    res.status(500).json({ err, message: 'Server-side error occured.' });
  }
});
