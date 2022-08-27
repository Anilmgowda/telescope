import React,{ useState } from "react";
import {Container} from "react-bootstrap"
import { Outlet} from 'react-router-dom'
import {Navigationbar} from "../../commonComponents/Navbar"

const ParentContainer = () => {
  return (
    <>
      <Navigationbar/>
      <Container className="main-box">
        <Outlet/>
      </Container>
    </>
  );
};

export default ParentContainer ;
