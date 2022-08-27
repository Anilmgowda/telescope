import React from "react";
import { Row, Col } from "react-bootstrap";


const CommonError = ({errorMessage, isBlurredRequired}) => {
    return (
        <Row className="m-0 mt-5">
            {isBlurredRequired && <Col xs={12} className="blank-box mb-3"></Col>}
            <Col xs={12} className=" p-4 text-center warningText">{errorMessage}</Col>
        </Row>
    )
}
export default CommonError;