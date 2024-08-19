import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/sidebar/Sidebar";

export default function Layout() {
  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="lg:ml-[250px] flex flex-col min-h-screen">
        <div className="flex-1 h-full px-4 py-10 mt-20 lg:px-12">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
