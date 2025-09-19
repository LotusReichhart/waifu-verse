import express from 'express';
import {refresh} from "./adapter.js";

const router = express.Router();

router.get('/', refresh);

export default router;