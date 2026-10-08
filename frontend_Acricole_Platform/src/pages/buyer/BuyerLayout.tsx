import { Outlet } from "react-router-dom";
import Navbar from '../../components/Navbar';

function BuyerLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default BuyerLayout;