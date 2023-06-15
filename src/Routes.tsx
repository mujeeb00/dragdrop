import { Routes, Route } from "react-router-dom";
import ContainerSort from "./pages/ContainerSort";

const MainRoutes = () => (
  <Routes>
    <Route path="/" element={<ContainerSort />} />
  </Routes>
);

export default MainRoutes;
