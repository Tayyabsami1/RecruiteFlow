import { Outlet,useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import '../Styles/Layout.scss';

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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Apply dark class to body element
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`layout ${isDark ? 'dark' : ''}`}>
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