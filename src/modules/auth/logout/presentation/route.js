import express from 'express';
import {logout} from "./adapter.js";

const router = express.Router();

router.get('/', logout);

export default router;