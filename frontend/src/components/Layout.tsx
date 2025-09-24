import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import '../css/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar onExpandChange={setIsSidebarMinimized} />
      <div className={`layout-content ${isSidebarMinimized ? 'expanded' : ''}`}>
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;