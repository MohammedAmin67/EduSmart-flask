import express from 'express';
import auth from "../middlewares/auth.middleware.js";
import { getProfile, updateProfile, uploadAvatar } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.put('/me/avatar', auth, ...uploadAvatar);

export default router;