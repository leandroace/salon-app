import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import ReservasPage from "./pages/ReservasPage";
import {ReservasFormPage} from "./pages/ReservasFormPage";
import { Navigation } from "./components/Navigation";
function App () {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/reservas"/>} />
        <Route path="/reservas" element={<ReservasPage/>} />
        <Route path="/reservas-create" element={<ReservasFormPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App