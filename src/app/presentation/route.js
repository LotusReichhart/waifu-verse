import {Router} from "express";
import {renderHomePage, renderPrivacyPolicyPage, renderTermsOfUsePage} from "./adapter.js";
import {optionalAuthMiddleware} from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(optionalAuthMiddleware);

router.get('/', renderHomePage);
router.get('/privacy-policy', renderPrivacyPolicyPage);
router.get('/terms-of-use', renderTermsOfUsePage);

export default router;
