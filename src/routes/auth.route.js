import {Router} from 'express';
import { login, register, registerVerification } from '../controllers/auth.controller.js';
export const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/register/verify', registerVerification);