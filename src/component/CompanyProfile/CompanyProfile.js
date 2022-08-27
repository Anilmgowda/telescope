import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import Highcharts from "highcharts/highstock";
import { ReactComponent as AlexaSvg } from "../../assets/images/icon_svg/alexa.svg";

import {
  getCompanyProfileFavorite,
  investorsearchReferences,
} from "../../store/actions";
import {
  axiosCompanyProfileDocumentType,
  axiosCompanyProfileFavorite,
  axiosCompanyProfileFileUploads,
  axiosEmailHistoryInstance,
  axiosReferenceListInstance,
  axiosCompanyUpdatesInstance,
  axiosTPPipelineInstance,
  axiosCompanyFavouriteInstance,
} from "../../config/appConfig/axiosInstance";
import { ReactComponent as BackSvg } from "../../assets/images/icon_svg/back.svg";
import "./companyProfile.scss";
import { AddFilterModal } from "../Modal/AddFiltermodal";
import { UploadDocumentModal } from "../Modal/UploadDocumentModal";
import { getemailhistory } from "../../store/actions/referenceAction";
import {
  getCompanyFavourite,
  getCompanyProfileDocumentTypes,
  getCompanyProfileFileUploads,
} from "../../store/actions/companyProfileAction";
import { useCancelRequests } from "../../customHooks";
import Loader from "../../commonComponents/Loader/Loader";
import {
  getCompanyUpdateForFilter,
  getPipeLine,
} from "../../store/actions/dashBoardAction";
import { SetAlertModal } from "../Modal/SetAlertModal";
import Chart from "../../commonComponents/Chart/Chart";
import { capitalize } from "../../utils/capitalizeFirstLetter";
import { removeUnderScoreAndCapitalize } from "../../utils/removeUnderScoreAndCapitalize";


const CompanyProfile = () => {
  useCancelRequests(
    axiosCompanyProfileDocumentType,
    axiosCompanyProfileFavorite,
    axiosCompanyProfileFileUploads,
    axiosEmailHistoryInstance
  );
  const { domain } = useParams();
  const [queryParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState(false);
  const [documentType, setDocumentType] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [graphData, setGraphData] = useState({});
  console.log(domain)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.dashBoardReducer);
  //   useEffect(() => {
  //     dispatch(getDashBoardDetails())
  //   }, []);
  // moment(new Date(new Date().setHours(0, 0, 0, 0))).format()
  const [payload, setPayload] = useState({
    start_time: moment(new Date("2022-04-15T06:15:47.155447+00:00")).format(),
    end_time: moment(new Date("2022-06-28T06:15:47.155447+00:00")).format(),
  });

  const [
    referenceReducer,
    emailHistory,
    emailError,
    referenceData,
    fileUploads,
    documentTypes,
    fileUploadStatus,
    favResult,
    filterSearchData,
    selectedMatrices,
    companyFavourite

  ] = useSelector(({ referenceReducer, companyProfileReducer, discoveryReducer }) => [
    referenceReducer?.searchResult,
    referenceReducer?.emailHistory,
    referenceReducer?.emailError,
    referenceReducer?.referenceData,
    companyProfileReducer?.fileUploads,
    companyProfileReducer?.documentTypes,
    companyProfileReducer?.fileUploadStatus,
    companyProfileReducer?.favResult,
    discoveryReducer?.filterSearchData,
    discoveryReducer?.selectedMatrices,
    companyProfileReducer?.companyFavourite,
  ]);

  const [tpPipeline] = useSelector(({ dashBoardReducer }) => [
    dashBoardReducer?.tpPipeline?.results,
  ]);



  const [companyFilterUpdateReducer] = useSelector(
    ({ companyUpdateReducer }) => [companyUpdateReducer?.filterUpdate?.results]
  );
  useEffect(() => {
    let newData = {}

    if (filterSearchData?.linkedin) {
      newData = filterSearchData?.linkedin?.results?.reduce((accum, obj) => {
        selectedMatrices.forEach((ele, i) => {
          if (accum.series[i]?.data && ele != 'filter_ops') {
            accum.series[i].data.push(obj[ele]);
            accum.series[i].name = removeUnderScoreAndCapitalize(ele);
          }
          else if (ele != 'filter_ops')
            accum.series.push({ data: [obj[ele]] })
        })

        accum.xAxis.categories.push(moment(obj._time).format("L"))
        return accum
      }, { title: { text: 'Linkedin Stats' }, series: [{ data: [] }], xAxis: { categories: [] } })
      setGraphData({ ...graphData, linkedin: { options: newData } })

    } else if (filterSearchData?.alexa) {
      newData = filterSearchData?.alexa?.results?.reduce((accum, obj) => {
        selectedMatrices.forEach((ele, i) => {
          if (accum.series[i]?.data && ele != 'filter_ops') {
            accum.series[i].data.push(obj[ele]);
            accum.series[i].name = removeUnderScoreAndCapitalize(ele);
          }
          else if (ele != 'filter_ops')
            accum.series.push({ data: [obj[ele]] })
        })

        accum.xAxis.categories.push(moment(obj._time).format("L"))
        return accum
      }, { title: { useHTML: true, text: 'Alexa Stats' }, series: [{ data: [] }], xAxis: { categories: [] } })

      setGraphData({ ...graphData, alexa: { options: newData } })

    }
    setTimeout(() => console.log(graphData), 1000)

  }, [filterSearchData])
  useEffect(() => {
    dispatch(
      getPipeLine(axiosTPPipelineInstance, {
        start: new Date(moment().subtract(7, "days")),
        end: new Date(),
      })
    );
    dispatch(getCompanyFavourite(axiosCompanyFavouriteInstance, { domain: queryParams.get("company_domain") }))
  }, []);
  console.log(companyFavourite)
  const handleBack = () => {
    navigate("/dashboard");
  };
  useEffect(() => {
    dispatch(
      getemailhistory(axiosEmailHistoryInstance, {
        start: "2020-05-20T03:15:47.155447+00:00",
        end: "2022-06-25T06:15:47.155447+00:00",
        domain: queryParams.get("company_domain"),
      })
    );

    dispatch(
      getCompanyProfileFileUploads(axiosCompanyProfileFileUploads, {
        from_timestamp: "2020-05-20T03:15:47.155447+00:00",
        to_timestamp: "2022-06-25T06:15:47.155447+00:00",
        affinity_id: queryParams.get("affinity_company_id"),
      })
    );
    dispatch(getCompanyProfileDocumentTypes(axiosCompanyProfileDocumentType));
    dispatch(investorsearchReferences(axiosReferenceListInstance, payload));
  }, []);

  useEffect(() => {
    if (showUploadModal) setShowUploadModal((state) => !state);
  }, [fileUploadStatus]);

  const handleFav = () => {
    dispatch(
      getCompanyProfileFavorite(axiosCompanyProfileFavorite, {
        affinity_id: queryParams.get("affinity_company_id"),
        domain: queryParams.get("company_domain"),
      })
    );
  };

  useEffect(() => {
    dispatch(
      getCompanyUpdateForFilter(axiosCompanyUpdatesInstance, {
        ...payload,
        domain: queryParams.get("company_domain"),
      })
    );
  }, []);

  const onDocumentTypeChange = (e) => {
    const { value } = e.currentTarget;
    setDocumentType(value);
  };

  const filterData = () => {
    const data = fileUploads?.data?.filter((obj) =>
      documentType ? obj.document_type === documentType : true
    );
    data && setFilteredData(data);
  };

  useEffect(() => {
    filterData();
  }, [documentType]);

  return (
    <>
      {openFilter && (
        <AddFilterModal
          onClose={(stat) => setOpenFilter(stat)}
          modalOpen={openFilter}
        />
      )}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={(stat) => setShowUploadModal(stat)}
          modalOpen={showUploadModal}
        />
      )}
      {showAlertModal && (
        <SetAlertModal
          domain={queryParams.get("company_domain")}
          onClose={(stat) => setShowAlertModal(stat)}
          modalOpen={showAlertModal}
        />
      )}


      <Row className="m-b-30">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="backStyle" onClick={handleBack}>
              <BackSvg />
            </div>
            <span className="main-heading">Accrualify</span>
            <span>
              <Button
                variant="primary"
                className="m-r-10"
                disabled={favResult || companyFavourite?.response?.favourite}
                onClick={handleFav}
              >
                {favResult || companyFavourite?.response?.favourite ? "Favourited" : "Set Favourite"}
              </Button>
              <Button variant="primary" onClick={() => setShowAlertModal(true)}>Set Alert</Button>
            </span>
          </div>
          <div className="top-header-box d-flex align-items-center justify-content-between ">
            <span className="main-title">Scopers: Nicole, Zack</span>
            <span className="d-flex align-items-center w-50">
              <span style={{ width: "35%" }}>Affinity Actions: </span>
              <Form.Select
                aria-label="Default select example"
                className="w-50 m-r-5"
              >
                <option>SQL</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
              <Form.Select
                aria-label="Default select example"
                className="w-50 m-l-5"
              >
                <option>Amit</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </span>
          </div>
        </Col>
      </Row>
      <Row className="m-b-30">
        <Col xs={12}>
          <div className="d-flex align-items-center justify-content-between">
            <span className="main-title">Company Stats</span>
            <Button variant="primary" onClick={() => setOpenFilter(true)}>
              Set Filter
            </Button>
          </div>
          <div className="divider mt-3 mb-3"></div>
        </Col>
      </Row>
      <Row>
        {graphData?.alexa && <Col md={4}>
          <Chart highcharts={Highcharts}
            options={graphData?.alexa?.options}
          />
        </Col>}
        {graphData?.linkedin && <Col md={4}>
          <Chart highcharts={Highcharts}
            options={graphData?.linkedin?.options}
          />
        </Col>
        }
        {/* <Col md={4}>
          {graphData?.alexa && <Chart highcharts={Highcharts}
            options={graphData?.alexa?.options}
          />}
        </Col> */}
      </Row>
      <Row className="m-b-30 ">

        <Col md={8}>
          <div className="main-title mb-2">Email</div>
          <Card className="p-3" style={{ height: "380px" }}>
            <div className="custom-table-pipeline table">
              <ul className="table-header"
              style={{
                outline:"solid"
               }}
              >
                <li>From</li>
                <li>To</li>
                <li>Subject</li>
                <li>Date</li>
              </ul>

              <ul className="table-body">
                {emailError ? (
                  <div
                    className="card-body-paragraph lightGrey m-t-15"
                    style={{ textAlign: "center" }}
                  >
                    {emailError}
                  </div>
                ) : (
                  emailHistory?.results?.map((item, indx) => {
                    return (
                      <>
                        <li key={indx} className="custom-table-body">
                          <div className="singleLineTxt">
                            {item.scoper_name}
                          </div>
                          <div className="singleLineTxt">
                            {item.participant_names}
                          </div>
                          <div className="singleLineTxt">
                            {item.subject || "not available"}
                          </div>
                          <div className="singleLineTxt">
                            {item.email_timestamp}
                          </div>
                        </li>
                      </>
                    );
                  })
                )}
              </ul>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-20 h-100" style={{ maxHeight: "420px" }}>
            <div className="main-title mb-2">Company Updates</div>
            <div className="divider mt-2 mb-2"></div>
            <div style={{ overflowY: "overlay", height: "100%" }}>
              {!companyFilterUpdateReducer ? (
                <Loader
                  scale={30}
                  message={"Loading Company Updates..."}
                  customStyle={"child"}
                />
              ) : companyFilterUpdateReducer?.length > 0 ?
                companyFilterUpdateReducer?.map((det, inx) => {
                  let domain = det.company_domain;
                  if (!/^https?:\/\//i.test(domain)) {
                    domain = "https://" + domain;
                  }
                  return (
                    <div key={inx}>
                      <div className="main-paragraph singleLineTxt">
                        {det?.title}
                      </div>
                      <div className="card-body-paragraph w-75 singleLineTxt mb-2">
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
                      <hr />
                    </div>
                  );
                }) : <div className="card-body-paragraph lightGrey">
                  You have no company updates yet.
                </div>
              }
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="m-b-30 h-100">
        <Col md={8}>
          <div className="main-title mb-2">Reference</div>
          <Card className="p-3 h-100" style={{ maxHeight: "420px" }}>
            <div className="custom-table-pipeline table">
              <ul className="table-header"
              style={{
                outline:"solid"
               }}
              >
                <li>Project</li>
                <li>People Involved</li>
                <li>Content</li>
                <li>Scope</li>
                <li>Date</li>
              </ul>

              <ul className="table-body">
                {!referenceData ? (
                  <Loader
                    scale={30}
                    message={"Loading Reference..."}
                    customStyle={"child"}
                  />
                ) : !referenceData?.error ? (
                  referenceData?.results?.map((item, indx) => {
                    const contents = item?.content?.replace(/\n|<.*?>/g, "");

                    return (
                      <>
                        <li key={indx} className="custom-table-body">
                          <div className="singleLineTxt">
                            {item?.project?.length == 0
                              ? "No Project"
                              : item?.project[0]}
                          </div>
                          <div className="singleLineTxt">
                            {item?.people_names?.length == 0
                              ? "No Name"
                              : item?.people_names[0]}
                          </div>
                          <div className="singleLineTxt">{contents}</div>
                          <div className="singleLineTxt">
                            {item?.scope ? item?.scope : "No Scope"}
                          </div>
                          <div className="singleLineTxt">
                            {" "}
                            {moment(item?.date).format("MMM DD YYYY")}
                          </div>
                        </li>
                      </>
                    );
                  })
                ) : (
                  <div className="card-body-paragraph lightGrey text-center m-t-15">
                    You have no references.
                  </div>
                )}
              </ul>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <div className="main-title mb-2">TP Status History</div>
          <Card className="p-20 h-100" style={{ maxHeight: "420px" }}>
            {/* <div sty>
                            {store.companyUpdates?.map((det, inx) => {
                                return (
                                    <div className="company-details-container" key={inx} onClick={(det) => handleCompanyDetails(det)}>
                                        <div className="company-details-wrapper">{det.details}</div>
                                        <hr />
                                    </div>
                                )
                            })}
                        </div>
                    </Card>  */}
            <div className="custom-table-pipeline table">
              <ul className="table-header"
                style={{
                  outline:"solid"
                 }}
              >
                <li>TP Status</li>
                <li>Domain</li>
              </ul>

              <ul className="table-body">
                {tpPipeline &&
                  tpPipeline?.map((item, indx) => {
                    return (
                      <>
                        <li key={indx} className="custom-table-body">
                          <div className="singleLineTxt">{item?.tp_status}</div>
                          <div className="singleLineTxt">{item?.domain}</div>
                        </li>
                      </>
                    );
                  })}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="m-b-30 h-100" style={{ marginTop: "70px" }}>
        <Col md={12}>
          <div className="d-flex align-items-center justify-content-between">
            <span className="main-title">Documents</span>
            <span className="d-flex align-items-center w-50 m-l-20 justify-content-between">
              <span style={{ width: "20%" }}>Document Type: </span>
              <Form.Select
                aria-label="Default select example"
                value={documentType}
                onChange={onDocumentTypeChange}
                className="w-50 m-r-5"
                style={{ fontSize: "14px" }}
              >
                <option value="" hidden>{'Select Document Type'}</option>
                {documentTypes?.data?.map((item, index) => {
                  return <option value={item}>{capitalize(item)}</option>;
                })}
              </Form.Select>
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(!showUploadModal)}
              >
                Upload Document
              </Button>
            </span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className="p-3" style={{ height: "380px", overflow: "auto" }}>
            <div className="custom-table">
              <ul className="table-header">
                <li>Scoper</li>
                <li>Content</li>
                <li>Type</li>
                <li>Date</li>
              </ul>
              {/* {allReferences.searchResult == null && (
                <Loader
                  scale={10}
                  message={"Loading Document..."}
                  customStyle={"child"}
                />
              )} */}
              <ul className="table-body">
                {fileUploads?.data && filteredData?.length > 0 ? (
                  filteredData?.map((item, indx) => {
                    return (
                      <>
                        <li key={indx} className="custom-table-body">
                          <div
                            className="singleLineTxt"
                            style={{
                              flex: 2,
                            }}
                          >
                            {item?.scoper}
                          </div>
                          <div
                            className="singleLineTxt"
                            onClick={() => window.open(item.object_id)}
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            click to see content
                          </div>
                          <div className="singleLineTxt">
                            {item?.document_type}
                          </div>
                          <div className="singleLineTxt">
                            {item?.created_at?.split(",")[0]}
                          </div>
                        </li>
                      </>
                    );
                  })
                ) : (
                  <div className="card-body-paragraph lightGrey text-center m-t-15">
                    No data available to preview.
                  </div>
                )}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
      {/* </Row> */}
    </>
  );
};

export default CompanyProfile;
