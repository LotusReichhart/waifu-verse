import {Router} from "express";

import {googleAuthenticate, googleCallbackAuth} from "../../../../shared/middlewares/google.middleware.js";
import {googleCallBack} from "./controller.js";

const router = Router();

router.get('/', googleAuthenticate);
router.get('/callback', googleCallbackAuth, googleCallBack);

export default router;