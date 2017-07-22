import stripe from 'stripe';
import { STRIPE_CLIENT_SECRET } from './config';

export default stripe(STRIPE_CLIENT_SECRET);
