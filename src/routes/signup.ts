import express from 'express';
import register from '../controllers/signup.js';
const router = express.Router();

router.post('/signup', register);
router.get('/signup', (req, res) => {
    res.status(200).json({ message: 'Signup endpoint is working' });
});

export default router;
