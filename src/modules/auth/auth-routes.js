import {Router} from "express";

import loginRoutes from './login/presentation/route.js';
import registerRoutes from "./register/presentation/route.js";

const router = Router();

router.use('/login', loginRoutes);
router.use('/register', registerRoutes);

export default router;