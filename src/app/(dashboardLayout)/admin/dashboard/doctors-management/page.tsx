import DoctorsTable from "@/components/modules/Admin/DoctorsTable";
import { getDoctors } from "@/services/doctor.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";


const DoctorManagementPage = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['doctors'],
        queryFn: getDoctors,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 1 hour
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DoctorsTable></DoctorsTable>
        </HydrationBoundary>
    );
};

export default DoctorManagementPage;