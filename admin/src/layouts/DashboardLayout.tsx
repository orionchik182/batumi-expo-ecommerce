import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"


function DashboardLayout() {
  return (
    <div>
        <div className="drawer lg:drawer-open">
            <input type="checkbox" className="drawer-toggle" id="my-drawer"/>
            <div className="drawer-content">
                <Navbar />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <Sidebar />
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout