import type { Request, Response } from "express";
import { prisma } from '../lib/prisma'

// Types for Request Body
interface CreatePropertyBody {
  name: string;
  type: string;
  isSpecial: string;
  bedrooms?: number;
  bathrooms?: number;
  price: string;
  city?: string;
  address?: string;
  area: string;
  description: string;
  status: string;
  images: { url: string; isThumbnail: boolean }[];
  amenities: { name: string; photoUrl: string }[];
  neighborhoods: {
    name: string;
    time: string;
    description?: string;
    iconType: string;
  }[];
}

export const createProperty = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreatePropertyBody;

    // Prisma "Nested Write" creates the property and all related data in one transaction
    const property = await prisma.property.create({
      data: {
        name: data.name,
        type: data.type,
        isSpecial: data.isSpecial,
        bathrooms: data.bathrooms,
        bedrooms: data.bedrooms,
        price: data.price,
        city: data.city,
        address: data.address,
        area: data.area,        
        description: data.description,
        status: data.status,
        images: {
          create: data.images.map((img) => ({
            url: img.url,
            isThumbnail: img.isThumbnail,
          })),
        },
        amenities: {
          create: data.amenities.map((am) => ({
            name: am.name,
            photoUrl: am.photoUrl,
          })),
        },
        neighborhoods: {
          create: data.neighborhoods.map((n) => ({
            name: n.name,
            time: n.time,
            description: n.description,
            iconType: n.iconType,
          })),
        },
      },
      include: {
        images: true,
        amenities: true,
        neighborhoods: true,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create property" });
  }
};

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    console.log("request hitted")
    // 1. Parse query parameters (Default: Page 1, Limit 10)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Fetch Total Count and Data in parallel using a Transaction
    // This ensures we get the total number of items and the specific page data simultaneously
    const [total, properties] = await prisma.$transaction([
      prisma.property.count(), // Count all properties
      prisma.property.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc", 
        },
        include: {         
          images: {
            where: { isThumbnail: true },
            take: 1,
          },
        },
      }),
    ]);

    // 3. Return structured response with pagination meta data
    res.json({
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching lawra properties" });
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { images: true, amenities: true, neighborhoods: true },
    });

    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Error fetching property" });
  }
};

// Update Property Status Only
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expect { "status": "Sold" }

    const updated = await prisma.property.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
};

// Update IsSpecial Only
export const updateIsSpecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isSpecial } = req.body; // Expect { "isSpecial": "Yes" }

    const updated = await prisma.property.update({
      where: { id: Number(id) },
      data: { isSpecial },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating special status" });
  }
};

// Full Update (Delete old relations and re-create)
export const updatePropertyFull = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body as CreatePropertyBody;
    const propId = Number(id);

    // Using a transaction to ensure clean update
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Update scalar fields
      await tx.property.update({
        where: { id: propId },
        data: {
          name: data.name,
          type: data.type,
          isSpecial: data.isSpecial,
          description: data.description,
          status: data.status,
        },
      });

      // 2. Handle Images: Delete all old ones, insert new ones
      await tx.propertyImage.deleteMany({ where: { propertyId: propId } });
      await tx.propertyImage.createMany({
        data: data.images.map((img) => ({
          propertyId: propId,
          url: img.url,
          isThumbnail: img.isThumbnail,
        })),
      });

      // 3. Handle Amenities
      await tx.amenity.deleteMany({ where: { propertyId: propId } });
      await tx.amenity.createMany({
        data: data.amenities.map((am) => ({
          propertyId: propId,
          name: am.name,
          photoUrl: am.photoUrl,
        })),
      });

      // 4. Handle Neighborhoods
      await tx.neighborhood.deleteMany({ where: { propertyId: propId } });
      await tx.neighborhood.createMany({
        data: data.neighborhoods.map((n) => ({
          propertyId: propId,
          name: n.name,
          time: n.time,
          description: n.description,
          iconType: n.iconType,
        })),
      });

      return await tx.property.findUnique({
        where: { id: propId },
        include: { images: true, amenities: true, neighborhoods: true },
      });
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update property" });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.property.delete({ where: { id: Number(id) } });
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
};
