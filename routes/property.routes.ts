// src/routes/property.routes.ts
import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateStatus,
  updateIsSpecial,
  updatePropertyFull,
  deleteProperty,
} from "../controllers/property.controller";
import {
  createNewLaunch,
  deleteNewLaunch,
  getAllNewLaunches,
  getNewLaunchById,
  updateNewLaunch,
} from "../controllers/newLaunchController";

const router = Router();

router.post("/create", createProperty);
router.get("/readAll", getAllProperties);
router.get("/readOne/:id", getPropertyById);
router.put("/update/:id", updatePropertyFull);
router.delete("/delete/:id", deleteProperty);

// Specific update APIs
router.patch("/:id/status", updateStatus);
router.patch("/:id/is-special", updateIsSpecial);

// New Launches routes
router.post("/new-launches/create", createNewLaunch);
router.get("/new-launches/readAll", getAllNewLaunches);
router.get("/new-launches/readOne/:id", getNewLaunchById);
router.delete("/new-launches/:id", deleteNewLaunch);

export default router;
