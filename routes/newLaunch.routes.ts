import { Router } from "express";
import {
  createNewLaunch,
  getAllNewLaunches,
  getNewLaunchById,
  updateNewLaunch,
  deleteNewLaunch,
} from "../controllers/topProperty/topPropertiesControllers";
import { uploadMultipleFields } from "../middleware/uploadFile";

const newLaunchRouter = Router();

newLaunchRouter.post("/top_properties/create", uploadMultipleFields([{name: 'property_photo', maxCount: 1}], 'newLaunch'), createNewLaunch);
newLaunchRouter.get("/top_properties/readAll", getAllNewLaunches);
newLaunchRouter.get("/top_properties/readOne/:id", getNewLaunchById);
newLaunchRouter.put("/top_properties/update/:id", updateNewLaunch);
newLaunchRouter.delete("/top_properties/delete/:id", deleteNewLaunch);

export default newLaunchRouter;
