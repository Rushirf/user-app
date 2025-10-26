'use server'

import axios from "axios";

export const getUsersApi = async ({
  page = 1,
  limit = 10,
  search = "",
  gender = ""
}: {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
}) => {
  try {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      
    );

    return response?.data;
  } catch (error) {
    console.error("Error fetching users list:", error);
    throw error;
  }
};
export const registerUserApi = async (updatedData: Record<string, any>) => {
  try {
 
    const form = new FormData();

    Object.entries(updatedData).forEach(([key, value]) => {
      if (value instanceof File || value instanceof Blob) {
        // If value is a File or Blob, append directly
        form.append(key, value);
      } else if (value !== undefined && value !== null) {
        // Otherwise, convert to string
        form.append(key, String(value));
      }
    });
    // const response = await axiosInstance.put(`/nutrition-plans/${id}`, updatedData);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
     return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
       console.error(
      "Error adding user",
      error?.response?.data?.message || error.message
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong while adding user.",
    };
   
  }
};
export const getUserDetailsApi = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`
    );

    return response?.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
export const deleteUserApi = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
     console.error(
      "Error deleting user",
      error?.response?.data?.message || error.message
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong while deleting user.",
    };
  }
};