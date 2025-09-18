import {Router} from "express";
import {renderPrivacyPolicyPage, renderTermsOfUsePage} from "./controller.js";
import {optionalAuthMiddleware} from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.get('/privacy-policy', optionalAuthMiddleware, renderPrivacyPolicyPage);
router.get('/terms-of-use', optionalAuthMiddleware, renderTermsOfUsePage);

export default router;