import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Form, Card } from "react-bootstrap";
import {
  getCompanyProfileDocumentTypes,
  uploadFile,
} from "../../store/actions/companyProfileAction";
import { useSelector, useDispatch } from "react-redux";
import {
  axiosCompanyProfileDocumentType,
  axiosCompanyProfileFileUploads,
} from "../../config/appConfig/axiosInstance";
import { ReactComponent as DeleteSvg } from "../../assets/images/icon_svg/delete.svg";
import { ReactComponent as DocumentSvg } from "../../assets/images/icon_svg/document.svg";

import { capitalize } from "../../utils/capitalizeFirstLetter";
import './document.scss';

export const UploadDocumentModal = ({ onClose, modalOpen }) => {
  const [documentTypes] = useSelector(({ companyProfileReducer }) => [
    companyProfileReducer?.documentTypes,
  ]);

  const inputRef = useRef();
  const dropZoneRef = useRef();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const browseFiles = () => inputRef.current.click();

  const onFileUpload = () => {
    const payload = new FormData();
    payload.append("file", file);
    dispatch(uploadFile(axiosCompanyProfileFileUploads, payload));
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  useEffect(() => {
    dispatch(getCompanyProfileDocumentTypes(axiosCompanyProfileDocumentType));
    if (!dropZoneRef.current) return;
    let dropZone = dropZoneRef.current;
    dropZone.addEventListener("dragenter", handleDragIn);
    dropZone.addEventListener("dragleave", handleDragOut);
    dropZone.addEventListener("dragover", handleDrag);
    dropZone.addEventListener("drop", handleDrop);
  }, [file]);

  const onFileSelect = (e) => {
    setFile(e.currentTarget.files[0]);
  };
  const deleteDoc = () => setFile(null);

  return (
    <Modal
      show={modalOpen}
      onHide={onClose}
      aria-labelledby=""
      size="lg"
      className="document"

    >
      <Modal.Header className="custom-modal-header">
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <input type="file" hidden ref={inputRef} onChange={onFileSelect} />
      <hr style={{ margin: "0px 24px" }} />
      <Modal.Body>
        {!file ? (
          <div
            ref={dropZoneRef}
            style={{
              textAlign: "center",
              alignItems: "center",
            }}
            id="drop-zone"
          >
            <div>
              <svg
                width="39"
                height="54"
                viewBox="0 0 39 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.75 14.3438V0H2.4375C1.08672 0 0 1.12852 0 2.53125V51.4688C0 52.8715 1.08672 54 2.4375 54H36.5625C37.9133 54 39 52.8715 39 51.4688V16.875H25.1875C23.8469 16.875 22.75 15.7359 22.75 14.3438ZM29.3698 37.1261H22.75V45.5636C22.75 46.4959 22.0228 47.2511 21.125 47.2511H17.875C16.9772 47.2511 16.25 46.4959 16.25 45.5636V37.1261H9.63016C8.17984 37.1261 7.4557 35.3025 8.48555 34.2404L18.2782 24.1471C18.9536 23.4499 20.0444 23.4499 20.7198 24.1471L30.5124 34.2404C31.5433 35.3025 30.8202 37.1261 29.3698 37.1261ZM38.2891 11.0742L28.3461 0.738281C27.8891 0.263672 27.2695 0 26.6195 0H26V13.5H39V12.8566C39 12.1922 38.7461 11.5488 38.2891 11.0742Z"
                  fill="#595D5F"
                />
              </svg>
            </div>

            <Modal.Title className="subTitle">
              Drag & drop your documents here
              <h4>OR</h4>
            </Modal.Title>

            <Modal.Title class="text-center">
              <Button variant="secondary" onClick={browseFiles}>
                Browse Files
              </Button>
            </Modal.Title>
          </div>
        ) : (
          <>
            <span style={{ width: "20%" }}>Document Type: </span>
            <Form.Select
              aria-label="Default select example"
              className="w-50 m-r-5"
            >
              {documentTypes?.data?.map((item, index) => {
                return <option value={index}>{item}</option>;
              })}
            </Form.Select>
            <Card
              className="p-3"
              style={{
                padding: "5px",
                height: "60px",
                marginTop: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="singleLineTxt">
                  <DocumentSvg />

                  {capitalize(file.name)}
                </div>
                <div>
                  <button
                    onClick={deleteDoc}
                    style={{
                      border: "none",
                      border: "1px solid grey",
                      borderRadius: "5px",
                    }}
                  >
                    <DeleteSvg />
                  </button>
                </div>
              </div>
            </Card>
          </>
        )}
      </Modal.Body>
      <hr style={{ margin: "16px 24px 0px 24px" }} />
      <Modal.Footer>
        <Button variant="light" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onFileUpload}>
          Upload Document
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
