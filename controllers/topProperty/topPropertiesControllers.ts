import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

/**
 * CREATE
 */
export const createNewLaunch = async (req: any, res: Response) => {
  try {
    const { property_type, property_name, property_desc, property_link, property_photo_link } = req.body;

    const property_photo =
      req.file || (req.files && req.filePaths["property_photo"])
        ? req.filePaths["property_photo"][0]
        : property_photo_link;

    const newLaunch = await prisma.newLaunches.create({
      data: {
        property_type,
        property_name,
        property_desc,
        property_photo,
        property_link
      },
    });

    res
      .status(201)
      .json({
        status: true,
        data: newLaunch,
        message: "Property Created Successfully!",
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to create new launch" });
  }
};

/**
 * READ ALL
 */
export const getAllNewLaunches = async (_req: Request, res: Response) => {
  try {
    const launches = await prisma.newLaunches.findMany({
      orderBy: { createdAt: "desc" },
    });

    res
      .status(200)
      .json({
        status: true,
        data: launches,
        message: "Properties fetched successfuly",
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch launches" });
  }
};

/**
 * READ ONE
 */
export const getNewLaunchById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const launch = await prisma.newLaunches.findUnique({
      where: { p_id: id },
    });

    if (!launch) {
      return res
        .status(404)
        .json({ status: false, message: "Launch not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        data: launch,
        message: "Property fetched successfully",
      });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to fetch launch" });
  }
};

/**
 * UPDATE
 */
export const updateNewLaunch = async (req: any, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { property_type, property_name, property_desc, property_link, property_photo_link } = req.body;

    const property_photo =
      req.file || (req.files && req.filePaths["property_photo"])
        ? req.filePaths["property_photo"][0]
        : property_photo_link;

    const updatedLaunch = await prisma.newLaunches.update({
      where: { p_id: id },
      data: {
        property_type,
        property_name,
        property_desc,
        property_photo,
        property_link
      },
    });

    res
      .status(200)
      .json({
        status: true,
        message: "Property Updated Successfully",
        data: updatedLaunch,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to update launch" });
  }
};

/**
 * DELETE
 */
export const deleteNewLaunch = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.newLaunches.delete({
      where: { p_id: id },
    });

    res.status(200).json({ status: true, message: "Launch deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to delete launch" });
  }
};
