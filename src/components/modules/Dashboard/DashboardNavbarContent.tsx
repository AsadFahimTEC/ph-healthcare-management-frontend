import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { useState } from "react";

interface DashboardNavbarProps{
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string
}

const DashboardNavbarContent = ({dashboardHome, navItems, userInfo}: DashboardNavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
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