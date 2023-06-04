import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import MyProjects from './MyProjects';

const Home = () => {
  const navigate = useNavigate();



  useEffect(() => {
    let username = localStorage.getItem("username");

    if (username === "" || username === null) {
      navigate("/login")
    }

  })

  return (
    <MyProjects />
  )
}

export default Home