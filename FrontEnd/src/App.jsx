import { RouterProvider } from "react-router-dom";
import { Router } from "./Routes/Route";
import { useEffect } from "react";
import { fetchProducts } from "./features/productsSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthStatus } from "./selectors/authSelectors.jsx";
import { selectProductsStatus } from "./selectors/ProductsSelectors.jsx";
import { fetchUser } from "./features/authSlice.jsx";

function App() {
    const dispatch = useDispatch();
    const AuthStatus = useSelector(selectAuthStatus);
    const ProductsStatus = useSelector(selectProductsStatus);
    useEffect(() => {
        if (ProductsStatus === "idle") {
            dispatch(fetchProducts());
        }
    }, [ProductsStatus, dispatch]);

    useEffect(() => {
        if (AuthStatus === "idle") {
            dispatch(fetchUser());
        }
    }, [AuthStatus, dispatch]);
    return (
        <>
            <RouterProvider router={Router} />
        </>
    );
}

export default App;
