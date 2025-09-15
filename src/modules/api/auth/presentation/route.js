import { Router } from "express";
import {rateLimitNoView} from "../../../../app/middlewares/rate-limiter-middleware.js";
import {postResendOTP} from "./controller.js";

const router = Router();

router.post('/otp/new',rateLimitNoView(5, 60 * 1000), postResendOTP);

export default router;