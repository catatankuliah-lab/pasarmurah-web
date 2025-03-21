import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { MaintenancePage } from "../pages/MaintenancePage";

import LoginPage from "../pages/auth/LoginPage";

import Role2PusatRekap from "../pages/2/rekap/indexPage";

import Role4PIC from "../pages/4/lo/indexPage";
import Role4PICRekap from "../pages/4/rekap/indexPage";

const AppRoutes = () => {
    const id_role = localStorage.getItem('id_role');
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            {id_role == "2" && (
                <>
                    <Route path="/2/dashboard" element={<DashboardPage />} />
                    <Route path="/2/rekap" element={<Role2PusatRekap />} />

                </>
            )}
            {id_role == "4" && (
                <>
                    <Route path="/4/dashboard" element={<DashboardPage />} />
                    <Route path="/4/lo" element={<Role4PIC />} />
                    <Route path="/4/rekap" element={<Role4PICRekap />} />

                </>
            )}

            <Route path="*" element={<MaintenancePage />} />
        </Routes>
    );
}
export default AppRoutes;