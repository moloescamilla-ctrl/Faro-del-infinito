import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import Landing from "./pages/Landing.jsx";
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pago" element={<Payment />} />
        <Route path="/confirmacion" element={<Confirmation />} />
      </Routes>
      <WhatsAppButton />
    </>
  );
}

export default App;
