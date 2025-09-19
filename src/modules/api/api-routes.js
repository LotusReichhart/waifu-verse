import {Router} from "express";

import authApiRoutes from "./auth/presentation/route.js";

const router = Router();

router.use('/auth', authApiRoutes);

export default router;