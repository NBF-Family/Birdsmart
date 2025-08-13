import type { ListingOut, ListingCreate } from "../../types/listing";
import api from "./api";

export const listingApi = {
  // Get all listings
  getAllListings: async (): Promise<ListingOut[]> => {
    try {
      const response = await api.get<ListingOut[]>('/listings/');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to fetch listings');
    }
  },

  // Get a single listing by ID
  getListing: async (listingId: string): Promise<ListingOut> => {
    try {
      const response = await api.get<ListingOut>(`/listings/${listingId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to fetch listing');
    }
  },

  // Get current user's listings
  getMyListings: async (): Promise<ListingOut[]> => {
    try {
      const response = await api.get<ListingOut[]>('/listings/my-listings');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to fetch your listings');
    }
  },

  // Create a new listing
  createListing: async (listingData: ListingCreate): Promise<ListingOut> => {
    try {
      const response = await api.post<ListingOut>('/listings/', listingData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        // Handle complex validation errors
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map((err: any) => {
            const field = err.loc[err.loc.length - 1];
            return `${field}: ${err.msg}`;
          }).join(', ');
          throw new Error(errorMessages);
        }
        // Handle simple string errors
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to create listing');
    }
  }
};
