import express, { Request, Response, NextFunction } from 'express';
const router = express();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Kolo (💼 )!');
});
export default router;