import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PublicOutlet from "./PublicOutlets";
import PrivateOutlet from "./PrivateOutlet";
import HomePage from "../pages/home/HomePage";
import BeneficiariesListPage from "../pages/beneficiariesList/BeneficiariesListPage";
import UploadbeneficiariesPage from "../pages/uploadBeneficiaries/UploadbeneficiariesPage";
import BeneficiariesDetailsPage from "../pages/beneficiariesDetails/BeneficiariesDetailsPage";
import AddDisbursementPage from "../pages/addDisbursement/AddDisbursementPage";
import AllBeneficiariesListPage from "../pages/allBeneficiariesList/AllBeneficiariesListPage";
import PaymentStatusPage from "../pages/paymentStatus/PaymentStatusPage";
import { useSelector } from "react-redux";

const RouterComponent = () => {
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: <PublicOutlet />,
      children: [
        {
          index: true,
          element: <LoginPage />,
        },
      ],
    },
    {
      path: "/",
      element: <PrivateOutlet />,
      children: [
        {
          element: <HomePage />,
          children: [
            {
              path: "dashboard",
              element: <DashboardPage />,
            },
            {
              path: "beneficiaries-list/:villageId/:villageName/:totalBeneficiaries",
              element: <BeneficiariesListPage />,
            },
            {
              path: "upload-beneficiaries/:villageId",
              element:
                userRole === "0" ? (
                  <UploadbeneficiariesPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                ),
            },
            {
              path: "beneficiaries-details/:villageId/:khatauni/:id?",
              element: <BeneficiariesDetailsPage />,
            },
            {
              path: "add-disbursement/:villageName/:khatauni",
              element:
                userRole === "0" ? (
                  <AddDisbursementPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                ),
            },
            {
              path: "all-beneficiaries-list",
              element: <AllBeneficiariesListPage />,
            },
            {
              path: "payment-status",
              element:
                userRole !== "0" ? (
                  <PaymentStatusPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                ),
            },
          ],
        },
      ],
    },
  ]);

  return router;
};

export default RouterComponent;
