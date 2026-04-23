import React from 'react'

import Navbar from "../components/Home/Navbar";
import Hero from '../components/Home/Hero';
import Products from '../components/Home/Products';

const Home = () => {
  return (
    <>
      <Navbar />
        <Hero />
          <Products />
    </>
  )
}

export default Home