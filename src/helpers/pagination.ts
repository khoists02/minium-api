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
  