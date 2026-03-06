import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";

interface DashboardNavbarProps{
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string
}

const DashboardNavbarContent = ({dashboardHome, navItems, userInfo}: DashboardNavbarProps) => {
    return (
        <div>
            {/* Mobile Menu Toggle Button And Menu */}

            {/* Search Component */}

            {/* Right Side Actions */}

            {/* Notification */}

            {/* User DropDown */}
            
        </div>
    );
};

export default DashboardNavbarContent;