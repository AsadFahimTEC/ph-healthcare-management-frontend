"use client";

import { getDoctors } from "@/services/doctor.service";
import { useQuery } from "@tanstack/react-query";

const DoctorsTable = () => {
     const { data : doctorDataResponse } = useQuery({
        queryKey: ["doctors"],
        queryFn: getDoctors
    });

    const { data : doctors } = doctorDataResponse! || [];
    console.log(doctors);

    return (
        <div>
            DoctorsTable
        </div>
    );
};

export default DoctorsTable;