// This file will help use to import all the pages in one file and export them
// to use them in one import statement in the App.js file
import Login from "./Login";
import SignUp from "./SignUp";
import Layout from "./Layout";
import Home from "./Home";
import About from "./About";


import AdminHome from "./Admin/Home";
import AdminLayout from "./Admin/AdminLayout";
import ManageUsers from "./Admin/ManageUsers";
import ManageJobs from "./Admin/ManageJobs";

import CompleteProfile from "./JobSeeker/CompleteProfile"
import Dashboard from "./JobSeeker/Dashboard"
import JobList from "./JobSeeker/JobsList"


export {Login, SignUp, Layout, Home, About,AdminLayout,AdminHome,CompleteProfile,Dashboard,JobList,ManageUsers,ManageJobs};
