import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();



  useEffect(() => {
    let username = localStorage.getItem("username");


    if (username === "" || username === null) {
      navigate("/login")
    } else {
      navigate("/requests");
    }
  })

  return (
    <div>Home</div>
  )
}

export default Home