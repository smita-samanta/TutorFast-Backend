import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    hello: 'World!',
    user: req.user,
  });
});

export default router;
