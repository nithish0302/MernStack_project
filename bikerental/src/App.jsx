import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerFrontPage from "./Components/CustomerFrontPage";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import CarPage from "./Components/CarPage";
import BikePage from "./Components/BikePage";
import Order from "./Components/Order";
import AboutUs from "./Components/AboutUs";
import ContactPage from "./Components/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerFrontPage />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/BikePage" element={<BikePage />} />
        <Route path="/CarPage" element={<CarPage />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
