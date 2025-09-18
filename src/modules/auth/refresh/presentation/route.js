import express from 'express';
import {refresh} from "./controller.js";

const router = express.Router();

router.get('/', refresh);

export default router;