import { Request } from "express";
import { Model } from "sequelize";

// Helper function to calculate pagination
export const calculatePagination = (
    page: number,
    limit: number,
    totalItems: number
  ): { skip: number; totalPages: number } => {
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { skip, totalPages };
  };
  

  export const getPaginationFromRequest = (req: Request, totalItems: number) => {
    const page = parseInt(req.query.page as string) || 1; // default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // default to limit 10

   // Calculate pagination from helper function
   const { skip, totalPages } = calculatePagination(page, limit, totalItems);
   return { skip, totalPages, limit, page };
  }