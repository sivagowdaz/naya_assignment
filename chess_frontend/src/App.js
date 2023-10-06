import Onboarding from "./page/Onboarding";
import Chess from "./page/Chess";
import {
    createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Onboarding/>,
    },
    {
        path: "/chess/:gameId",
        element: <Chess/>
    },
]);

export default router;
