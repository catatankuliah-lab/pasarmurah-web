import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { MaintenancePage } from "../pages/MaintenancePage";

import LoginPage from "../pages/auth/LoginPage";

import Role4PIC from "../pages/4/lo/indexPage";

const AppRoutes = () => {
    const id_role = localStorage.getItem('id_role');
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            {id_role == "4" && (
                <>
                    <Route path="/4/lo" element={<Role4PIC />} />
                    <Route path="/4/dashboard" element={<DashboardPage />} />

                </>
            )}
            <Route path="*" element={<MaintenancePage />} />
        </Routes>
    );
}
export default AppRoutes;