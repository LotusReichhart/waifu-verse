import {Router} from "express";

import loginRoutes from './login/presentation/route.js';
import registerRoutes from "./register/presentation/route.js";
import forgotPasswordRoutes from "./forgot-password/presentation/route.js";
import googleRoutes from "./google/presentation/route.js";

const router = Router();

router.use('/login', loginRoutes);
router.use('/register', registerRoutes);
router.use('/forgot-password', forgotPasswordRoutes);
router.use('/google', googleRoutes);

export default router;