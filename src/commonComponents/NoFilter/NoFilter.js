import React from "react";
import { Row, Col } from "react-bootstrap";


const Nofilter = () => {
    return (
        <Row className="m-0 mt-5">
            <Col xs={12} className="blank-box mb-3"></Col>
            <Col xs={12} className=" p-4 text-center">Hello! We are waiting for you to set filter for us! </Col>
        </Row>
    )
}
export default Nofilter;