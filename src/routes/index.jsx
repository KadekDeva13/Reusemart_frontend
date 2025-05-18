import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OwnerPage from "../pages/OwnerPage";
import AdminPage from "../pages/adminPage";

const router = createBrowserRouter([
    {
        path: "*",
        element: <div>Routes Not Found!</div>,
    },
    {
        children: [
            {
                path: "/owner",
                element: <OwnerPage />,
            },
            {
                path: "/admin",
                element: <AdminPage />,
            }
        ],
    },
    {
        
    },
    {
        
    },
]);

const AppRouter = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default AppRouter;