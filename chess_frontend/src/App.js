import Onboarding from "./page/Onboarding";
import Chess from "./page/Chess";
import ErrorPage from "./page/ErrorPage";
import {
    createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Onboarding/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/chess/:gameId",
        element: <Chess/>
    },
]);

export default router;
