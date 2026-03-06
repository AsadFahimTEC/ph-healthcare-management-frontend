import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/lib/axios/navItems";
import { getUserInfo } from "@/services/auth.service";
import { NavSection } from "@/types/dashboard.types";


const DashboardNavbar = async () => {
    const userInfo = await getUserInfo()
    const navItems: NavSection[] = getNavItemsByRole(userInfo.role)

    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
    return (
        <div>
            DashboardNavbar
        </div>
    );
};

export default DashboardNavbar;