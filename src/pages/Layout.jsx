import React from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom' 
import Footer from '../components/Footer';
const Layout = () => {
    return (
      
          <div id="wrapper">
            <Sidebar/>

              <div id="content-wrapper" class="d-flex flex-column">

                  <div id="content">

                    <Navbar/>

                      <div class="container-fluid">
                          <Outlet />
                      </div>
                  </div>
                  <Footer/>
              </div>

            </div>



    );
  };

export default Layout