import { Router } from "express";
import {
    generateRandomLogs,
    getAllLogs,
    getLog,
} from "../controllers/log.controllers.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/:sensorId")
    .get(isLoggedIn, getAllLogs);

router.route("/:id")
    .get(isLoggedIn, getLog)

router.route("/generateData")
    .get(isLoggedIn, generateRandomLogs);

export default router;