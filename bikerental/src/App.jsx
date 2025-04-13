import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerFrontPage from "./Components/Customer/CustomerFrontPage";
import SignUp from "./Components/General/SignUp";
import SignIn from "./Components/General/SignIn";
import CarPage from "./Components/General/CarPage";
import BikePage from "./Components/General/BikePage";
import Order from "./Components/Customer/Order";
import AboutUs from "./Components/General/AboutUs";
import ContactPage from "./Components/General/Contact";
import ForgotPassword from "./Components/General/ForgotPass";
import SelectionPage from "./Components/General/Home";
import VendorFrontPage from "./Components/Vendor/VendorFrontPage";
import AddBike from "./Components/Vendor/AddBike";
import AddCarPage from "./Components/Vendor/AddCar";
import OrderConfirmation from "./Components/Customer/OrderConfirmation";
import MyBookingsPage from "./Components/Customer/MyBookingsPage";
import CustomerProfile from "./Components/Customer/CustomerProfile";
import VendorProfile from "./Components/Vendor/VendorProfile";
import VendorRequestsPage from "./Components/Vendor/VendorRequestsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/customer" element={<CustomerFrontPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/BikePage" element={<BikePage />} />
        <Route path="/CarPage" element={<CarPage />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/vendor" element={<VendorFrontPage />} />
        <Route path="/addbike" element={<AddBike />} />
        <Route path="/addcar" element={<AddCarPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/vendor-requests" element={<VendorRequestsPage />} />
        <Route path="/my-profile" element={<CustomerProfile />} />
        <Route path="/myvenprofile" element={<VendorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
