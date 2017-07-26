import express, { Router } from 'express';
import { PORT } from './config';

const app = express();

import bodyParser from 'body-parser';


const root = Router();
const raw = Router();

// Apply middlewares
import headersMiddleware from './middleware/headers';
import authMiddleware from './middleware/auth';

app.use(headersMiddleware);

// Parses 'application/json' bodies and hanges the
// resulting object at `req.body`.
root.use(bodyParser.json());
root.use(bodyParser.urlencoded({ extended: true }));
root.use(authMiddleware);

raw.use(bodyParser.raw({ type: '*/*' }));


// Attach API routes
import testRouter from './routes/test';
import userRouter from './routes/user';
import sessionRouter from './routes/session';
import tutorRouter from './routes/tutor';
import stripeRouter from './routes/stripe';
import appointmentRouter from './routes/appointment';
import rawRouter from './routes/raw';

// Raw routes.
raw.use('/', rawRouter);
app.use('/raw', raw);

// processed routes.
root.use('/test', testRouter);
root.use('/user', userRouter);
root.use('/session', sessionRouter);
root.use('/tutor', tutorRouter);
root.use('/stripe', stripeRouter);
root.use('/appointment', appointmentRouter);
app.use('/', root);


// Start the server.
const server = app.listen(PORT, () => {
  console.log(`Listening on ${server.address().port}...`);
});
