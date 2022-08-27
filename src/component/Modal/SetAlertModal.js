import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Card, Row, Col, ModalBody } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { axiosCompanyAlertInstance, axiosCompanySaveAlertsInstance } from "../../config/appConfig/axiosInstance";
import { getCompanyAlerts, saveCompanyAlert } from "../../store/actions/companyProfileAction";
import { removeUnderScoreAndCapitalize } from "../../utils/removeUnderScoreAndCapitalize";


import './document.scss';

export const SetAlertModal = ({ onClose, modalOpen, domain }) => {
    const filter_ops = ["EQUAL_TO", "GREATER_THAN", "LESS_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN_OR_EQUAL_TO"]

    const [isNewAlert, setIsNewAlert] = useState(false)
    const [newAlertData, setNewAlertData] = useState({ filter_criteria: 'GREATER_THAN', filter_criteria2: "GREATER_THAN", merge_operator: "OR", metrics: "marketing_hire", metrics2: "marketing_hire", value: 0, value2: 0 })
    const dispatch = useDispatch();
    const [companyAlerts] = useSelector(({ companyProfileReducer }) => [
        companyProfileReducer?.companyAlerts,
    ]);
    const onChange = (e) => setNewAlertData(alertData => ({ ...alertData, [e.target.name]: e.target.value }))
    const saveData = () => {
        dispatch(saveCompanyAlert(axiosCompanySaveAlertsInstance,
            {
                "alert_data": [
                    {
                        "datasource": "LINKEDIN",
                        "filter_criteria": newAlertData.filter_criteria,
                        "metrics": newAlertData.metrics,
                        "value": newAlertData.value
                    },
                    {
                        "datasource": "LINKEDIN",
                        "filter_criteria": newAlertData.filter_criteria2,
                        "metrics": newAlertData.metrics2,
                        "value": newAlertData.value2
                    }
                ],
                "alert_name": newAlertData.alert_name,
                "merge_operator": newAlertData.merge_operator
            }
        ))
    }
    useEffect(() => {
        dispatch(getCompanyAlerts(axiosCompanyAlertInstance, { domain }))
    }, [])
    return (
        <Modal
            show={modalOpen}
            onHide={onClose}
            aria-labelledby=""
            size="lg"
            className="document"

        >
            <Modal.Header className="custom-modal-header">
                <Modal.Title>Add New Alert</Modal.Title>
                <Button variant="secondary" onClick={() => setIsNewAlert(true)}>
                    New Alert
                </Button>
            </Modal.Header>
            {!isNewAlert && companyAlerts?.error ? <ModalBody>No existing alerts. please create a new one</ModalBody> : !isNewAlert && <Modal.Body>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Alert:</Form.Label>
                            <Form.Control type="email" placeholder="Add alert name" />
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>}
            {isNewAlert && <Modal.Body>
                <Row>
                    <Col md={7}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Alert:</Form.Label>
                            <Form.Control
                                name='alert_name'
                                onChange={onChange}
                                type="text" placeholder="Add alert name" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Col md={1}>When:</Col>
                    <Col md={3}>  <Form.Group
                        className="mb-3 m-r-10 w-100"
                        controlId="formBasicEmail"
                    >
                        <Form.Select
                            aria-label="Default select example"
                            name='matrices'
                            onChange={onChange}
                            className=""
                        >
                            <option value="marketing_hire">Marketing hire</option>
                            <option value="sales_hire">Sales Hire</option>


                        </Form.Select>
                    </Form.Group></Col>
                    <Col md={1}>is</Col>
                    <Col md={3}> <Form.Group
                        className="mb-3 m-r-10 w-100"
                        controlId="formBasicEmail"
                    >

                        <Form.Select
                            aria-label="Default select example"
                            name='filter_criteria'
                            onChange={onChange}
                            className=""
                        >
                            {filter_ops?.map((filterData) => {
                                let filter = removeUnderScoreAndCapitalize(filterData)
                                return (
                                    <option value={filterData} className="text-capitalize">{filter}</option>
                                )
                            })}

                        </Form.Select>
                    </Form.Group></Col>
                    <Col md={2}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                name='value'
                                onChange={onChange}
                                type="number" />
                        </Form.Group>
                    </Col>
                    <Col col={1}>employees</Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <hr style={{ margin: "16px 24px 0px 24px" }} />
                    </Col>
                    <Col md={3}> <Form.Group
                        className="mb-3 m-r-10 w-100"
                        controlId="formBasicEmail"
                    >

                        <Form.Select
                            aria-label="Default select example"
                            name='merge_operator'
                            onChange={onChange}
                            className=""
                        >
                            <option value="OR">OR </option>
                            <option value="AND">AND </option>

                        </Form.Select>
                    </Form.Group></Col>
                    <Col md={4}>
                        <hr style={{ margin: "16px 24px 0px 24px" }} />
                    </Col>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Col md={1}>When:</Col>
                    <Col md={3}>  <Form.Group
                        className="mb-3 m-r-10 w-100"
                        controlId="formBasicEmail"
                    >
                        <Form.Select
                            name='metrics2'
                            onChange={onChange}
                            aria-label="Default select example"
                            className=""
                        >
                            <option value="marketing_hire">Marketing hire</option>
                            <option value="sales_hire">Sales Hire</option>

                        </Form.Select>
                    </Form.Group></Col>
                    <Col md={1}>is</Col>
                    <Col md={3}> <Form.Group
                        className="mb-3 m-r-10 w-100"
                        controlId="formBasicEmail"
                    >

                        <Form.Select
                            aria-label="Default select example"
                            name='filter_criteria2'
                            onChange={onChange}
                            className=""
                        >
                            {filter_ops?.map((filterData) => {
                                let filter = removeUnderScoreAndCapitalize(filterData)
                                return (
                                    <option value={filterData} className="text-capitalize">{filter}</option>
                                )
                            })}

                        </Form.Select>
                    </Form.Group></Col>
                    <Col md={2}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                name='value2'
                                onChange={onChange}
                                type="number" />
                        </Form.Group>
                    </Col>
                    <Col col={1}>employees</Col>
                </Row>
            </Modal.Body>}
            <Modal.Footer>
                <Button variant="light" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button variant="secondary" onClick={saveData}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
