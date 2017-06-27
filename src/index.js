import express from 'express';
import dotenv from 'dotenv-safe';

dotenv.load();
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

app.use('/test', testRouter);
app.use('/user', userRouter);

// Start the server.
const server = app.listen(process.env.PORT || 8888, () => {
  console.log(`Listening on ${server.address().port}...`);
});
