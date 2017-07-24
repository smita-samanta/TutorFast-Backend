import express from 'express';
import { PORT } from './config';

const app = express();

import bodyParser from 'body-parser';


// Apply middlewares
import headersMiddleware from './middleware/headers';
import authMiddleware from './middleware/auth';

app.use(headersMiddleware);

// Parses 'application/json' bodies and hanges the
// resulting object at `req.body`.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authMiddleware);


// Attach API routes
import testRouter from './routes/test';
import userRouter from './routes/user';
import sessionRouter from './routes/session';
import tutorRouter from './routes/tutor';
import stripeRouter from './routes/stripe';

app.use('/test', testRouter);
app.use('/user', userRouter);
app.use('/session', sessionRouter);
app.use('/tutor', tutorRouter);
app.use('/stripe', stripeRouter);


// Start the server.
const server = app.listen(PORT, () => {
  console.log(`Listening on ${server.address().port}...`);
});
