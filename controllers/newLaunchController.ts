import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'

// --- WRITE: Create a New Launch Property ---
export const createNewLaunch = async (req: Request, res: Response) => {
  try {
    // Determine types for inputs
    const { property_id, description } = req.body;

    // Basic Validation
    if (!property_id || !description) {
      return res.status(400).json({ error: "Property ID and Description are required" });
    }

    // Check if property already exists in new launch (since property_id is unique)
    const existing = await prisma.newLauchProperty.findUnique({
      where: { property_id: Number(property_id) }
    });

    if (existing) {
      return res.status(409).json({ error: "This property is already listed in New Launches." });
    }

    const newLaunch = await prisma.newLauchProperty.create({
      data: {
        property_id: Number(property_id),
        description: description,
      },
      include: {
        property: true // Fetch related property details immediately
      }
    });

    return res.status(201).json({ message: "Added to New Launches successfully", data: newLaunch });

  } catch (error: any) {
    console.error("Error creating new launch:", error);
    
    // Check for Prisma Foreign Key constraint failure (P2003)
    if (error.code === 'P2003') {
        return res.status(404).json({ error: "Property ID not found in main Property table." });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- READ: Get All New Launch Properties ---
export const getAllNewLaunches = async (req: Request, res: Response) => {
  try {
    const launches = await prisma.newLauchProperty.findMany({
      include: {
        property: true, // Includes full Property details (images, address, etc.)
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(launches);
  } catch (error) {
    console.error("Error fetching new launches:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- READ: Get Single New Launch by ID ---
export const getNewLaunchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const launch = await prisma.newLauchProperty.findUnique({
      where: { launch_id: Number(id) },
      include: { property: true },
    });

    if (!launch) {
      return res.status(404).json({ error: "New Launch entry not found" });
    }

    return res.status(200).json(launch);
  } catch (error) {
    console.error("Error fetching single launch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- WRITE: Update Description ---
export const updateNewLaunch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updatedLaunch = await prisma.newLauchProperty.update({
      where: { launch_id: Number(id) },
      data: { description },
    });

    return res.status(200).json({ message: "Updated successfully", data: updatedLaunch });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Record not found" });
    }
    console.error("Error updating launch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- DELETE: Remove from New Launches ---
export const deleteNewLaunch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.newLauchProperty.delete({
      where: { launch_id: Number(id) },
    });

    return res.status(200).json({ message: "Removed from New Launches successfully" });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Record not found" });
    }
    console.error("Error deleting launch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};