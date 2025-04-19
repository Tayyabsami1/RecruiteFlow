
import { Outlet } from 'react-router-dom'


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
        <h1>Navbar</h1>
      </div>

      <div className="content">
        <Outlet />
        <h1>Footer</h1>

      </div>

    </div>
  )
}

export default Layout