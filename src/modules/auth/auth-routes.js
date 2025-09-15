import {Router} from "express";

import registerRoutes from "./register/presentation/route.js";

const router = Router();

router.use('/register', registerRoutes);

export default router;