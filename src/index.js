import express from 'express';
import { PORT } from './config';

const app = express();

import bodyParser from 'body-parser';


// Apply middlewares
import headersMiddleware from './middleware/headers';
import authMiddleware from './middleware/auth';

app.use(headersMiddleware);
app.use(authMiddleware);


// Parses 'application/json' bodies and hanges the
// resulting object at `req.body`.
app.use(bodyParser.json());


// Attach API routes
import testRouter from './routes/test';
import userRouter from './routes/user';
import sessionRouter from './routes/session';
import tutorRouter from './routes/tutor';

app.use('/test', testRouter);
app.use('/user', userRouter);
app.use('/session', sessionRouter);
app.use('/tutor', tutorRouter);


// Start the server.
const server = app.listen(PORT, () => {
  console.log(`Listening on ${server.address().port}...`);
});
