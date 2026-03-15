/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IDoctor } from "@/types/doctor.types";

export const getDoctors = async (queryString : string) => {
  try {
    const doctors = await httpClient.get<IDoctor[]>(
      queryString ? `/doctors?${queryString}` : "/doctors",
    );
    return doctors;
  } catch (error: any) {
    // Some query combinations (e.g. invalid sorting params) may return 400.
    // We handle gracefully so client can still render without crashing.
    console.error("Error fetching doctors:", error?.response?.status, error?.response?.data ?? error);

    return {
      success: false,
      message: error?.response?.data?.message ?? "Failed to fetch doctors",
      data: [],
    };
  }
};

// export const getAllSpecialties = async () => {
//     try {
//         const specialties = await httpClient.get<ISpecialty[]>("/specialties");
//         return specialties;
//     } catch (error) {
//         console.log("Error fetching specialties:", error);
//         throw error;
//     }
// }