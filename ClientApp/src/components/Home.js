import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import MyProjects from './MyProjects';

const Home = () => {
  const navigate = useNavigate();

  // If there is not username in localStorage, redirect to login page
  useEffect(() => {
    let username = localStorage.getItem("username");
    if (username === "" || username === null) navigate("/login")
  })

  // Return start page (MyProjects)
  return (
    <MyProjects />
  )
}

export default Home