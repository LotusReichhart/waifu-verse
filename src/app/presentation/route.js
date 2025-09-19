import {Router} from "express";
import {renderHomePage, renderPrivacyPolicyPage, renderTermsOfUsePage} from "./adapter.js";
import {optionalAuthMiddleware} from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.get('/', optionalAuthMiddleware, renderHomePage);
router.get('/privacy-policy', optionalAuthMiddleware, renderPrivacyPolicyPage);
router.get('/terms-of-use', optionalAuthMiddleware, renderTermsOfUsePage);

export default router;
