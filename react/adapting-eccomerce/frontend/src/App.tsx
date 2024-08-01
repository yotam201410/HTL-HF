import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import ProductsView from "./views/ProductsView";
import ProductView from "./views/ProductView";
import CartView from "./views/CartView";
import AddressesView from "./views/AddressesView";
import OrdersView from "./views/OrdersView";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/products" element={<ProductsView />} />
                <Route path="/product" element={<ProductView />} />
                <Route path="/cart" element={<CartView />} />
                <Route path="/addresses" element={<AddressesView />} />
                <Route path="/orders" element={<OrdersView />} />
            </Routes>
        </>
    );
}

export default App;
