import React from "react";
import { Row, Col, Modal, Button} from "react-bootstrap";
import { ReactComponent as SuccessSvg } from "../../assets/images/icon_svg/success.svg";
import { ReactComponent as FailedSvg } from "../../assets/images/icon_svg/failed.svg";



const SubmissionDialog = ({show, onHide, isSuccess, message}) => {
    return (
        <Modal
                show={show}
                onHide={onHide}
                dialogClassName="custom--modal"
                aria-labelledby=""
                size="md"
            >
                
                <Modal.Body className="custom-modal-body text-center p-4">
                    {isSuccess ? <div className="primaryGrey mb-3"><SuccessSvg/></div> : <div className="primaryGrey mb-3"><FailedSvg/></div>}
                    <div className="lightGrey mb-2">{message}</div>
                </Modal.Body>
                <Modal.Footer className="custom-modal-footer justify-content-center">
                    <Button variant="primary" onClick={onHide()}>Continue</Button>
                </Modal.Footer>
            </Modal>
    )
}
export default SubmissionDialog;