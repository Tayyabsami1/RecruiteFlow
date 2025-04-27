import { useMantineColorScheme } from '@mantine/core';
import React from 'react'
import { useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import { Outlet,useLocation } from 'react-router-dom';
import "../../Styles/Admin/AdminLayout.scss"

const AdminLayout = () => {
      const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

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

    useScrollToTop();

    // Apply dark class to body element
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

    return (
        <div className={`layout ${isDark?'dark':''}`}>
            <div className="navbar">
                <Navbar/>
            </div>
            <div className="content">
                <Outlet/>
            </div>
        </div>
    )
}

export default AdminLayout