import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/doctor.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";


const DoctorManagementPage = async  ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;
  /*
  {
  searchTerm: "cardio",
  page: "1",
  limit: "10",
  gender: "MALE",
  "appointFee[gt]": "500",
}
  */
  // ?searchTerm=cardio&page=1&limit=10&gender=MALE&appointFee[gt]=500

  // const queryString = Object.keys(queryParamsObjects).map((key) => `${key}=${queryParamsObjects[key]}`).join("&");

  //if the value is an array, we need to convert it to multiple query params with the same key
  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) {
        return "";
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");


  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["doctors", queryString],
      queryFn: () => getDoctors(queryString),
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 6, // 6 hours
    });
  } catch (error) {
    // Avoid crashing the entire page if the backend rejects invalid query params.
    // The client-side component will re-fetch and can handle the error state.
    console.error("Prefetch doctors failed:", error);
  }

//   await queryClient.prefetchQuery({
//     queryKey: ["specialties"],
//     queryFn: () => getAllSpecialties(),
//     staleTime: 1000 * 60 * 60 * 6, // 6 hours
//     gcTime: 1000 * 60 * 60 * 24, // 24 hours
//   });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DoctorsTable />
        </HydrationBoundary>
    );
};

export default DoctorManagementPage;