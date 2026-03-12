"use client";

import AppointmentBarChart from "@/components/shared/AppointmentBarChart";
import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/form/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const { data } = (adminDashboardData ||
    {}) as ApiResponse<IAdminDashboardData>;

  return (
    <div className="p-4 space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Appointments"
          value={data?.appointmentCount || 0}
          iconName="CalendarDays"
          description="Number of appointments scheduled"
        />

        <StatsCard
          title="Total Patients"
          value={data?.patientCount || 0}
          iconName="Users"
          description="Number of patients registered"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <AppointmentBarChart
            data={data?.barChartData || []}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <AppointmentPieChart
            data={data?.pieChartData || []}
          />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardContent;