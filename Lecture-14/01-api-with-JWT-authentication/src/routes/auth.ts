import express from 'express';
import { logIn, logOut } from '../controller/authController';

const router = express.Router();

router.get('/login', logIn);
router.get('/logout', logOut);

export default router;
