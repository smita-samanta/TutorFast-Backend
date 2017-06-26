import express from 'express';
const app = express();

// Apply middlewares
import headersMiddleware from './middleware/headers';

app.use(headersMiddleware);

// Attach API routes
import testRouter from './routes/test';

app.use('/test', testRouter);

const server = app.listen(process.env.PORT || 8888, () => {
  console.log(`Listening on ${server.address().port}...`);
});
