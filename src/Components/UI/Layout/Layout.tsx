// Layout.tsx
import { useState } from 'react';
import {Sidebar} from "../SideBar"
import { Header } from '../Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
