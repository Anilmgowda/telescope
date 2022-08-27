import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  InputGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { ReactComponent as AlexaSvg } from "../../assets/images/icon_svg/alexa.svg";
import { ReactComponent as SpyfuSvg } from '../../assets/images/icon_svg/spyfu.svg';
import { ReactComponent as LinkedInSvg } from '../../assets/images/icon_svg/linkedin.svg';
import {
  investorsearchReferences,
  getCompanyUpdateTemplate,
} from "../../store/actions";
import {
  getCompanyUpdateForFilter,
  getDashBoardDetails,
  getPipeLine,
  getCompanyUpdateType,
  getLoggedInUser,
} from "../../store/actions/dashBoardAction";

import {
  axiosTPPipelineInstance,
  axiosCompanyUpdatesInstance,
  axiosCompanyUpdateType,
  axiosUserInfoInstance,
  axiosReferenceSearchInstance
} from "../../config/appConfig/axiosInstance";
import Loader from "../../commonComponents/Loader/Loader";
import CommonError from "../../commonComponents/CommonError/CommonError";
import Paginations from "../../commonComponents/Pagination/Pagination";

import { ReactComponent as CalendarSvg } from "../../assets/images/icon_svg/calendar.svg";
import { ReactComponent as FilterSvg } from "../../assets/images/icon_svg/filter.svg";
import "./dashboard.scss";
import { capitalize } from "../../utils/capitalizeFirstLetter";
import { useCancelRequests } from "../../customHooks";
import { removeUnderScore } from "../../utils/removeUnderScore";


let timeout;
const Dashboard = () => {
  useCancelRequests(
    axiosCompanyUpdateType,
    axiosCompanyUpdatesInstance,
    axiosTPPipelineInstance,
    axiosReferenceSearchInstance
  );
  let ref = React.useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [referenceReducer] = useSelector(({ referenceReducer }) => [
    referenceReducer?.referenceData,
  ]);

  const [companyUpdateReducer] = useSelector(({ companyUpdateReducer }) => [
    companyUpdateReducer?.companyupdate,
  ]);
  const [companyUpdateTypeReducer] = useSelector(({ companyUpdateReducer }) => [
    companyUpdateReducer?.filterType,
  ]);

  const [companyFilterUpdateReducer] = useSelector(
    ({ companyUpdateReducer }) => [companyUpdateReducer?.filterUpdate]
  );

  const [companyFilterUpdateLoading] = useSelector(
    ({ companyUpdateReducer }) => [companyUpdateReducer?.companyDataLoading]
  );

  const [tpPipeline, userInfo] = useSelector(({ dashBoardReducer }) => [
    dashBoardReducer?.tpPipeline?.results,
    dashBoardReducer?.userInfo,
  ]);
  const store = useSelector((state) => state.dashBoardReducer);

  const [dateRange, setDateRange] = useState([
    new Date(moment().subtract(7, "days")),
    new Date(),
  ]);
  const [dateRangeFilter, setDateRangeFilter] = useState([
    new Date(moment().subtract(7, "days")),
    new Date(),
  ]);

  const [startDate, endDate] = dateRange;
  const [filterStartDate, filterEndDate] = dateRangeFilter;

  const [payload, setPayload] = useState({
    start_time: moment(new Date("2022-04-15T06:15:47.155447+00:00")).format(),
    end_time: moment(new Date("2022-06-28T06:15:47.155447+00:00")).format(),
  });

  const [showPopover, setShowPopover] = useState(false);
  const [showPopoverForFilter, setShowPopoverForFilter] = useState(false);

  const [dataToBeDisplayed, setDataToBeDisplayed] = useState([]);

  const [pipelineForm, setPipeline] = useState({
    searchText: "",
    isPipelineLoading: false,
    isError: false,
    errorMessage: "",
    pipeline: [],
    timeout: 0,
    currentPage: null,
    finalPipelineArray: [],
    offset: "",
    itemsPerPage: 10,
  });

  const [view, setView] = useState({
    isLoading: false,
    isError: false,
    errorMessage: "",
    showModal: false,
    modalContent: {},
  });
  const [companyModal, setCompanyModal] = useState({ showModal: false });
  const [tableview, setTableview] = useState({
    isLoading: false,
    isError: false,
    errorMessage: "",
    showModal: false,
    modalContent: {},
  });

  const handlePageChange = (pageObj, currentPage, offsets) => {
    setPipeline({
      ...pipelineForm,
      pipeline: pageObj,
      searchText: "",
      currentPage: currentPage,
      finalPipelineArray: pageObj,
      offset: offsets,
    });
  };

  const handlePerPageItem = (e) => {
    setPipeline({
      ...pipelineForm,
      itemsPerPage: Number(e.target.value),
    });
  };

  useEffect(() => {
    const payload = {
      start_time: moment(new Date(filterStartDate)).format(),
      end_time: moment(new Date(filterEndDate)).format(),
    };

    if (!companyUpdateReducer) {
      dispatch(getCompanyUpdateTemplate(axiosCompanyUpdatesInstance, payload));
      dispatch(getCompanyUpdateForFilter(axiosCompanyUpdatesInstance, payload));
      dispatch(getCompanyUpdateType(axiosCompanyUpdateType));
      dispatch(getLoggedInUser(axiosUserInfoInstance));
    }
  }, []);

  useEffect(() => {
    setDataToBeDisplayed(companyUpdateReducer?.results);
  }, [companyUpdateReducer]);

  useEffect(() => {
    dispatch(getDashBoardDetails());
    getPipelineDataFn();
  }, []);

  const handlefilterdate = (updatedDates) => {
    let pipelineRequest = {
      start_time: moment(
        updatedDates?.length ? updatedDates[0] : startDate
      ).format(),
      end_time: moment(
        updatedDates?.length ? updatedDates[1] : endDate
      ).format(),
    };
    setPayload({ ...payload, ...pipelineRequest });
  };

  const getPipelineDataFn = (updatedDates) => {
    setShowPopover(false);
    setPipeline({
      ...pipelineForm,
      isPipelineLoading: true,
      isError: false,
      errorMessage: "",
      searchText:"",
    });
    let pipelineRequest = {
      start: moment(
        updatedDates?.length ? updatedDates[0] : startDate
      ).format(),
      end: moment(updatedDates?.length ? updatedDates[1] : endDate).format(),
    };
    dispatch(getPipeLine(axiosTPPipelineInstance, pipelineRequest)).then(
      (res) => {
        if (res.status === "success") {
          setPipeline({
            ...pipelineForm,
            isPipelineLoading: false,
            isError: false,
            errorMessage: "",
          });
        } else {
          setPipeline({
            ...pipelineForm,
            isPipelineLoading: false,
            isError: true,
            errorMessage: res?.message || "Something went wrong!",
          });
        }
      }
    );
  };

  let filterData = companyFilterUpdateReducer?.results?.map(
    (ele) => ele.company_domain
  );
  filterData = filterData?.filter(
    (domain, index) => filterData.indexOf(domain) == index
  );

  let filterType = companyFilterUpdateReducer?.results?.map(
    (ele) => ele.update_type
  );
  filterType = filterType?.filter(
    (type, index) => filterType.indexOf(type) == index
  );

  const handleFilterSubmit = (update) => {
    setDateRangeFilter(update);
    handlefilterdate(update);
    if (update[1]) {
      document.getElementById("root").click();
      setTimeout(() => {
        onApplyFilter({ updateType: "date", update });
      });
    }
  };

  const handlePipelineSubmit = (update) => {
    setDateRange(update);
    if (update[1]) {
      document.getElementById("root").click();
      setTimeout(() => {
        getPipelineDataFn(update);
      });
    }
   
  };


  useEffect(() => {
    if (tpPipeline?.length) {
      let initial = tpPipeline.slice(0, 10);
      let offsets =
        1 + "-" + pipelineForm?.itemsPerPage + " of " + tpPipeline?.length;
      setPipeline({
        ...pipelineForm,
        pipeline: initial,
        isPipelineLoading: false,
        finalPipelineArray: initial,
        offset: offsets,
      });
    }
  }, [tpPipeline]);

  const updateSearch = (e) => {
    let searchtxt = e.target.value;

    setPipeline({
      ...pipelineForm,
      searchText: searchtxt?.trim(),
    });

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      let filteredList = pipelineForm?.finalPipelineArray?.filter((data) => {
        return (
          data.tp_status
            .toLocaleLowerCase()
            .includes(searchtxt?.trim()?.toLowerCase()) ||
          data.tp_owner
            .toLocaleLowerCase()
            .includes(searchtxt?.trim()?.toLowerCase()) ||
          data.company_name
            .toLocaleLowerCase()
            .includes(searchtxt?.trim()?.toLowerCase()) ||
          data.domain
            .toLocaleLowerCase()
            .includes(searchtxt?.trim()?.toLowerCase())
        );
      });
      setTimeout(() => {
        setShowPopover(false)
      },1000)
      setPipeline({
        ...pipelineForm,
        pipeline: filteredList,
        searchText: searchtxt?.trim(),
      });
    }, 500);
  };

  const handleModal = (item) => {
    setView({
      ...view,
      showModal: true,
      modalContent: item,
    });
  };

  const closeModal = () => {
    setView({
      ...view,
      showModal: false,
      modalContent: {},
    });
  };

  useEffect(() => {
    const payload = {
      start_time: moment(new Date(filterStartDate)).format(),
      end_time: moment(new Date(filterEndDate)).format(),
      conversation_type: "All"
    };
    dispatch(investorsearchReferences(axiosReferenceSearchInstance, payload))
      .then((resp) => {
        if (resp.status === "success") {
          setView({
            ...view,
            isError: false,
            errorMessage: "",
            isLoading: false,
          });
        } else {
          setView({
            ...view,
            isError: true,
            errorMessage: "Something went wrong!",
            isLoading: false,
          });
        }
      })
  }, []);

  const handleCompanyDetails = (compDetails) => {
    const { affinity_company_id, company_domain } = compDetails;
    navigate({
      pathname: "/companyProfile",
      search: new URLSearchParams({
        affinity_company_id,
        company_domain,
      }).toString(),
    });
  };

  const renderModal = () => {
    let finalContents = view?.modalContent?.content?.replaceAll(
      "<br><br>",
      "<br>"
    );
    return (
      <Modal
        show={view?.showModal}
        onHide={closeModal}
        dialogClassName="custom-modal"
        aria-labelledby=""
        size="lg"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="main-title">
            <span className="main-title singleLineTxt" style={{ cursor: "pointer", maxWidth: "75%" }}>{view?.modalContent?.conversation_type}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="primaryGrey mb-2">Reference:</div>
          <div className="lightGrey mb-2">
            <span dangerouslySetInnerHTML={{ __html: finalContents }}></span>
          </div>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <div className="d-flex mb-2">
            <span className="primaryGrey">Projects:</span>&nbsp;
            {view?.modalContent?.project?.length ?
              <span className="lightGrey singleLineTxt">{view?.modalContent?.project?.toString()}</span>
              : <div className="lightGrey">-</div>}
          </div>
          <div className="d-flex mb-2">
            <span className="primaryGrey">People Involved:</span>&nbsp;
            {view?.modalContent?.people_names?.length ? (
              <span className="lightGrey mb-2">
                {" "}
                {view?.modalContent?.people_names[0]}
              </span>
            ) : (
              <span className="lightGrey mb-2">-</span>
            )}
          </div>
          <div className="d-flex">
            <span className="primaryGrey">Date:</span>&nbsp;
            <span className="lightGrey mb-2">
              {moment(view?.modalContent?.date).format("MMM DD YYYY")}
            </span>
            &nbsp; &nbsp;
          </div>
        </Modal.Footer>
      </Modal>
    );
  };

  const companyUpdatesModal = () => {
    return (
      <Modal
        show={companyModal?.showModal}
        onHide={() => setCompanyModal({ showModal: false })}
        dialogClassName="custom-modal"
        aria-labelledby=""
        size="lg"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="main-title">
            <div className="main-title lightGrey">
              {companyModal?.data?.company_name || 'Company Not Available'}
            </div>
          </Modal.Title>
        </Modal.Header>
        {companyModal?.data?.update_content ? <Modal.Body className="custom-modal-body">
          <div className="lightGrey mb-2">
            <p>
              <span style={{ color: "black" }}>Affinity ID :&nbsp;</span>
              {companyModal?.data?.affinity_company_id}
            </p>
            <div className="custom-table-pipeline">

              <ul className="table-body" >
              {Object.keys(companyModal?.data?.update_content).map((key) => {
                  let val = typeof companyModal?.data?.update_content[key] === "object" ? "" : typeof companyModal?.data?.update_content[key] === "string" ? companyModal?.data?.update_content[key] : ""
                  return <>
                    <li key={key} className="custom-table-body">
                      <div className="singleLineTxt">
                        {key}
                      </div>
                      <div className="singleLineTxt">
                        {val? val : "No Data Available"}
                      </div>
                    </li>
                  </>
                })}
              </ul>
            </div>

          </div>
        </Modal.Body> : <Modal.Body>No Data Available</Modal.Body>}
        <Modal.Footer className="custom-modal-footer">
          <div className="d-flex mb-2">
            <div className="lightGrey mb-2">
              {companyModal?.data?.update_type && <> <span className="primaryGrey">Update Type:&nbsp; </span>
                {removeUnderScore(companyModal?.data?.update_type)}</>}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="primaryGrey">
              Date: &nbsp;
              <span className="lightGrey mb-2">
                {moment(companyModal?.data?.created_at).format("MMM DD YYYY")}
              </span>
            </div>
            <div>
              <Button onClick={() => handleCompanyDetails(companyModal?.data)}>
                View Details
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal >
    );
  };

  const handleTableCloseModal = () => {
    setTableview({
      ...tableview,
      showModal: false,
      modalContent: {},
    });
  };
  const onApplyFilter = (update) => {
    setShowPopoverForFilter(false);
    let reqParams = payload;
    if (update.updateType === "date") {
      reqParams = {
        ...payload,
        start_time: moment(update.update[0]).format(),
        end_time: moment(update.update[1]).format(),
      };
    } else if (update.updateType === "domain") {
      reqParams = {
        ...payload,
        domain: update.update,
      };
    }
    dispatch(getCompanyUpdateTemplate(axiosCompanyUpdatesInstance, reqParams));
  };

  const tableModal = () => {
    return (
      <Modal
        show={tableview?.showModal}
        onHide={handleTableCloseModal}
        dialogClassName="custom-modal"
        aria-labelledby=""
        size="lg"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="main-title">
            {tableview?.modalContent?.company ? (
              <span
                className="main-title w-75 singleLineTxt"
                style={{ cursor: "pointer", maxWidth: "75%" }}
              >
                {tableview?.modalContent?.company}
              </span>
            ) : (
              <div className="main-title lightGrey">No Project</div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="primaryGrey mb-2">Reference:</div>
          <div className="lightGrey mb-2">
            {tableview?.modalContent?.TP_Owner}
          </div>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <div className="d-flex mb-2">
            <span className="primaryGrey">People Involved:</span>&nbsp;
            {tableview?.modalContent?.people_names?.length ? (
              <span className="lightGrey mb-2"> </span>
            ) : (
              <span className="lightGrey mb-2">-</span>
            )}
          </div>
          <div className="d-flex">
            <span className="primaryGrey">Date:</span>&nbsp;
            <span className="lightGrey mb-2">
              {moment(tableview?.modalContent?.date).format("MMM DD YYYY")}
            </span>
            &nbsp; &nbsp;
          </div>
        </Modal.Footer>
      </Modal>
    );
  };

  const popover = (
    <Popover className="popover-filter">
      <Popover.Body>
        <div className=" mb-3">
          {" "}
          <Form.Control
            className="custom-search "
            name="keyboardText"
            type="text"
            placeholder="Search results"
            value={pipelineForm.searchText}
            onChange={updateSearch}
            
          />
        </div>
        <div className="">
          <span className="w-100">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                handlePipelineSubmit(update);
              }}
              maxDate={new Date()}
              dateFormat="MMM dd yyyy"
              className="custom-daterange-picker w-100"
              placeholderText={"Select date-range"}
            />
            &nbsp;
            <CalendarSvg className="iconClass" />
          </span>
        </div>
        <div></div>
      </Popover.Body>
    </Popover>
  );

  const handleUpdateType = (evnt) => {
    const typeData = companyUpdateReducer?.results?.filter(
      (company) => company?.update_type === evnt.target.value
    );
    setDataToBeDisplayed([...typeData]);
    setShowPopoverForFilter(false)
  };

  const filterpopover = (
    <Popover className="popover-filter">
      <Popover.Body>
        <div className=" mb-3">
          <Form.Select
            style={{ fontSize: "14px" }}
            aria-label="Default select example"
            onChange={handleUpdateType}
          >
            <option value="" hidden>Select Update Type</option>
            {companyUpdateTypeReducer?.results?.map((item) => {
              return (
                <>
                  <option value={item?.server_value}>
                    {item?.display_name}
                  </option>
                </>
              );
            })}
          </Form.Select>
        </div>

        <div className=" mb-3">
          <Form.Select
            aria-label="Default select example"
            style={{ fontSize: "14px" }}
            onChange={(e) => {
              setPayload({ ...payload, domain: e.target.value });
              onApplyFilter({ updateType: "domain", update: e.target.value });
            }}
          >
            <option value="" hidden>Select Domain</option>
            {filterData?.map((item, index) => {
              return <><option value={item}>{item}</option></>;
            })}
          </Form.Select>
        </div>
        <div className="">
          <span className="w-100">
            <DatePicker
              selectsRange={true}
              startDate={filterStartDate}
              endDate={filterEndDate}
              onChange={(update) => {
                handleFilterSubmit(update);
              }}
              maxDate={new Date()}
              dateFormat="MMM dd yyyy"
              className="custom-daterange-picker w-100"
              placeholderText={"Select date-range"}
            />
            &nbsp;
            <CalendarSvg className="iconClass" />
          </span>
        </div>
        <div></div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {view?.showModal && renderModal()}
      {companyModal?.showModal && companyUpdatesModal()}

      {tableview?.showModal && tableModal()}
      <Row className="m-b-30">
        <Col xs={12}>
          <div className="main-heading">
            Welcome {capitalize(userInfo?.email?.split("@")[0])}!
          </div>
        </Col>
      </Row>
      <Row className="m-b-30">
        <Col md={6} className="p-b-20">
          <Card className="p-20" style={{ height:"574px" }}>
            <div className="d-flex justify-content-between dashboard-page">
              <span className="main-title">Company Updates</span>
              <OverlayTrigger
                show={showPopoverForFilter}
                placement="left"
                overlay={filterpopover}
                rootClose={true}
                trigger={["click"]}
                onToggle={() => setShowPopoverForFilter(!showPopoverForFilter)}
              >
                <div className="btn-group-arrow">
                  <FilterSvg width="16px" height="16" />
                </div>
              </OverlayTrigger>
            </div>
            <div className="divider mt-2 mb-2"></div>
            <div style={{ height: "100%", overflowY: "overlay" }}>
              {!companyUpdateReducer || companyFilterUpdateLoading ? (
                <Loader
                  scale={30}
                  message={"Loading Company Updates..."}
                  customStyle={"child"}
                />
              ) : dataToBeDisplayed && dataToBeDisplayed?.length == 0 ? (
                <div className="card-body-paragraph lightGrey">
                  You have no company updates yet.
                </div>
              ) : (
                dataToBeDisplayed?.map((det, inx) => {
                  let domain = det.company_domain;
                  if (!/^https?:\/\//i.test(domain)) {
                    domain = "https://" + domain;
                  }
                  return (
                    <div
                      className="company-details-container"
                      key={inx}
                      // onClick={() => handleCompanyDetails()}
                      onClick={(e) =>
                        setCompanyModal({ data: det, showModal: true })
                      }
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                        marginRight: "25px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      ><div
                        style={{
                          display:"flex",
                          gap:"10px"
                        }}
                      >
                          {det?.title?.includes("alexa") ? <AlexaSvg /> : det?.title?.includes("spyfu") ? <SpyfuSvg /> : det?.title?.includes("linkedin") ? <LinkedInSvg /> : ""}
                          <div className="main-paragraph singleLineTxt position-relative" style={{left:"30px"}}>
                            {det?.title || "No Title"}
                          </div>
                        </div>
                        <div>
                          {moment(det?.created_at.slice(0, 10)).format("L")}
                        </div>
                      </div>

                      <div className="card-body-paragraph w-75 singleLineTxt mb-2 position-relative" 
                      style={{
                        left:"30px",
                        bottom:"5px"
                        }}>
                        {det?.company_name ? (
                          det?.company_name
                        ) : det?.company_domain ? (
                          <a
                            className="primaryGrey mb-2"
                            href={domain}
                            target="_blank"
                          >
                            {det?.company_domain}
                          </a>
                        ) : (
                          "No Company Name"
                        )}
                      </div>

                      <div
                        className="card-body-paragraph"
                        style={{ fontSize: "14px", textTransform: "lowercase" }}
                      >
                        {/* {det?.update_content} */}
                      </div>
                      <hr />
                    </div>
                  );
                })
              )}

              {store.companyUpdates?.map((det, inx) => {
                return (
                  <div
                    className="company-details-container"
                    key={inx}
                    onClick={() => handleCompanyDetails()}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="main-paragraph mb-2">{det.name}</div>
                    <div className="card-body-paragraph">{det.details}</div>
                    <hr />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <Row className="m-0">
            <Col md={12} className="mb-3 p-0">
              <Card className="p-20" style={{ height: "280px" }}>
                <div className="d-flex justify-content-between ">
                  <span className="main-title">Notifications</span>
                  <span>
                    <Button variant="light" disabled>
                      View All
                    </Button>
                  </span>
                </div>
                <div className="divider mt-2 mb-1"></div>
                <div
                  className="pt-3"
                  style={{ height: "100%", overflowY: "overlay" }}
                >
                  <div className="card-body-paragraph lightGrey">
                    You have no notifications yet.
                  </div>
                </div>
              </Card>
            </Col>
            <Col md={12} className="p-0">
              <Card className="p-20" style={{ height: "280px" }}>
                <div className="d-flex justify-content-between ">
                  <span className="main-title">Recent Conversations</span>
                  <span>
                    <Button
                      variant="light"
                      onClick={() => navigate("/conversations")}
                    >
                      View All
                    </Button>
                  </span>
                </div>
                <div className="divider mt-2 mb-1"></div>
                <div style={{ height: "100%", overflowY: "overlay" }}>
                  {!referenceReducer && (
                    <Loader
                      scale={30}
                      message={"Loading Conversations..."}
                      customStyle={"child"}
                    />
                  )}
                  {referenceReducer && referenceReducer.results?.length == 0 && (
                    <div
                      className="pt-3"
                      style={{ height: "100%", overflowY: "overlay" }}
                    >
                      <div className="card-body-paragraph lightGrey">
                        You have no recent conversations.
                      </div>
                    </div>
                  )}
                  {referenceReducer && referenceReducer.error && (
                    <div
                      className="pt-3"
                      style={{ height: "100%", overflowY: "overlay" }}
                    >
                      <div className="card-body-paragraph lightGrey">
                        Failed to load recent conversations.
                      </div>
                    </div>
                  )}
                  {referenceReducer?.results?.length !== 0 &&
                    referenceReducer?.results?.map((det, indx) => {
                      const contents = det?.content?.replace(/\n|<.*?>/g, "");
                      return (
                        <div
                          className="company-details-container"
                          key={indx}
                          onClick={() => handleModal(det)}
                        >
                          <div
                            className="main-paragraph w-75 singleLineTxt mb-2"
                            style={{ cursor: "pointer", maxWidth: "75%" }}
                          >
                            {det?.conversation_type}
                          </div>

                          <div
                            className="singleLineTxt mb-2 card-body-paragraph"
                            style={{ cursor: "pointer" }}
                          >
                            {contents}
                          </div>
                          <hr />
                        </div>
                      );
                    })}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="m-b-30">
        <Col xs={12}>
          <div className="mb-2 dashboard-page d-flex justify-content-between align-items-center">
            <span className="main-heading mb-2">Telescope Pipeline</span>
            <span className="">
              <OverlayTrigger
                show={showPopover}
                placement="auto"
                overlay={popover}
                rootClose={true}
                trigger={["click"]}
                onToggle={() => setShowPopover(!showPopover)}
              >
                <span className="btn-group-arrow">
                  {" "}
                  <FilterSvg width="16px" height="16" />{" "}
                </span>
              </OverlayTrigger>
            </span>
          </div>
          <Card className="p-3 m-b-20">
            {pipelineForm?.isPipelineLoading ? (
              <Loader
                scale={30}
                message={"Loading Company Stats..."}
                customStyle={"child"}
              />
            ) : pipelineForm?.isError ? (
              <CommonError
                errorMessage={pipelineForm?.errorMessage}
                isBlurredRequired={false}
              />
            ) : (
              <div className="custom-table-pipeline">
                <ul className="table-header">
                  <li>Company</li>
                  <li>TP Status</li>
                  <li>TP Owner</li>
                  <li>Company URL</li>
                </ul>
                <ul className="table-body">
                  {pipelineForm?.pipeline?.length ? (
                    pipelineForm?.pipeline?.map((item, indx) => {
                      let domain = item.domain;
                      if (!/^https?:\/\//i.test(domain)) {
                        domain = "https://" + domain;
                      }
                      return (
                        <>
                          <li key={indx} className="custom-table-body">
                            <div className="singleLineTxt">
                              {item.company_name}
                            </div>
                            <div className="singleLineTxt">
                              {item.tp_status}
                            </div>
                            <div className="singleLineTxt">{item.tp_owner}</div>
                            <div className="singleLineTxt">
                              <a
                                className="primaryGrey mb-2"
                                href={domain}
                                target="_blank"
                              >
                                {item.domain}
                              </a>
                            </div>
                          </li>
                        </>
                      );
                    })
                  ) : (
                    <div className="mt-3"> No data available to preview</div>
                  )}
                </ul>
              </div>
            )}
          </Card>
          {pipelineForm?.pipeline?.length ? (
            <Row className="m-0">
              <Col className="d-flex justify-content-center align-items-center pagination-box p-l-20 p-r-20 flex-wrap">
                <span className="d-flex justify-content-center align-items-center">
                  <span className="m-r-10">Page: </span>
                  <Form.Control
                    className="custom-pagination-input ml-2"
                    name="keyboardText"
                    type="text"
                    value={pipelineForm?.currentPage}
                    disabled
                  />
                </span>
                <span className="mb-2 mt-2">
                  <Paginations
                    itemsPerPage={pipelineForm?.itemsPerPage}
                    items={tpPipeline}
                    handleCurrent={handlePageChange}
                    currentPageInput={pipelineForm?.currentPage}
                  />
                </span>
                <span
                  className="d-flex justify-content-center align-items-center"
                  style={{ minWidth: "180px" }}
                >
                  <span className="m-r-10">{pipelineForm?.offset}</span>
                  <Form.Select
                    aria-label="Default select example"
                    className="per-page-item"
                    onChange={handlePerPageItem}
                    disabled={Number(pipelineForm?.currentPage) > 1}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </Form.Select>
                </span>
              </Col>
            </Row>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
