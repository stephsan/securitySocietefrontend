import React from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom' 
import Footer from '../components/Footer';
const Layout = () => {
    return (
      <div className='wrapper'>
        <Sidebar/>
        <div className="main">
          <Navbar/>
          <main className='content'>
            <div className='container-fluid p-0'>
              <Outlet />
            </div>
          </main>
          <Footer/>
        </div>
      </div>
    );
  };

export default Layout