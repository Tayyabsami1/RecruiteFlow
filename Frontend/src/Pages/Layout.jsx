
import { Outlet } from 'react-router-dom'


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the pathname changes
    const scrollContainer = document.querySelector('.layout');
    if (scrollContainer) {
      scrollContainer.style.scrollBehavior = 'auto';
      scrollContainer.scrollTop = 0;
    }
  }, [pathname]);
};

const Layout = () => {
  useScrollToTop();
  return (
    <div className='layout'>
      <div className="navbar">
        <Navbar />
      </div>

      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>

    </div>
  )
}

export default Layout