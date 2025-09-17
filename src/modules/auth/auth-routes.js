import {Router} from "express";

import loginRoutes from './login/presentation/route.js';
import registerRoutes from "./register/presentation/route.js";
import forgotPasswordRoutes from "./forgot-password/presentation/route.js";

const router = Router();

router.use('/login', loginRoutes);
router.use('/register', registerRoutes);
router.use('/forgot-password', forgotPasswordRoutes);

export default router;