import React, { useEffect, useState, useCallback } from 'react'
import moment from "moment"
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Highcharts from "highcharts";
import DatePicker from "react-datepicker";
import * as actionTypes from "../../store/actionTypes";

import { getScopers, searchReferences, getProjects } from "../../store/actions";
import { axiosReferenceSearchInstance, axiosScoperInstance, axiosProjectsInstance} from "../../config/appConfig/axiosInstance";
import Loader from "../../commonComponents/Loader/Loader";
import NoFilter from "../../commonComponents/NoFilter/NoFilter";
import CommonError from "../../commonComponents/CommonError/CommonError";
import Chart from "../../commonComponents/Chart/Chart";
import { useCancelRequests } from "../../customHooks";
import { Typeahead } from 'react-bootstrap-typeahead';

import { ReactComponent as ListViewSvg } from "../../assets/images/icon_svg/listView.svg";
import { ReactComponent as CardViewSvg } from "../../assets/images/icon_svg/cardView.svg";
import { ReactComponent as CalendarSvg } from "../../assets/images/icon_svg/calendar.svg";

import "react-datepicker/dist/react-datepicker.css";
import "./references.scss"
import 'react-bootstrap-typeahead/css/Typeahead.css';

let options, startDays, callMore=false, isSubmitClicked=false;
const References = () => {
    useCancelRequests(axiosReferenceSearchInstance, axiosScoperInstance);
    const dispatch = useDispatch();
    const [refSearchData, projectOptions] = useSelector(({ referenceReducer }) => [referenceReducer.searchResult, referenceReducer.projects])
    const [scopers] = useSelector(({ commonReducer }) => [commonReducer.scopers])

    const [view, setView] = useState({
        viewType: "cardView",
        isLoading: false,
        isError: false,
        errorMessage: "",
        btnFlag: false,
        showModal : false,
        modalContent: {}
    });

    const [form, setForm] = useState({
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(new Date().setHours(23, 59, 59, 0)),
        keyboardText: "",
        selectedScoper: "",
        // selectedPerson: null,
        selectedProjects: [],
        conversation_type: "All",
        errors: {},
        endDateIndex: null,
        isViewMoreLoading: false,
        isViewMoreBtnDisable : false,
        isExtraFilterAdded: false
    });

    useEffect(() => {
        dispatch(getScopers(axiosScoperInstance));
        setView({
            ...view,
            isLoading: true,
            btnFlag: true
        })
        loadReferenceList();
    }, [])

    useEffect(()=>{
        if(!projectOptions.length && form?.isExtraFilterAdded) {
            dispatch(getProjects(axiosProjectsInstance))
        }
    },[form?.isExtraFilterAdded])

    useEffect(() => {
        options = {
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: []
            },
            series: [{
                type: 'column',
                color: "#303c42",
                data: [],
                showInLegend: false,
                name: '',
            }]
        }
        updateGraphOption()
    }, [refSearchData])

    const updateGraphOption = () => {
        const noOfDays = moment(form?.endDate).diff(moment(form?.startDate), 'days')
        let groups
        if (noOfDays <= 7) {
            groups = refSearchData?.results?.reduce((groups, data) => {
                let date;
                for (var i = 0; i <= noOfDays; i++) {
                    date = moment(form?.startDate).add(i, 'days');
                    date = date.format("MMM DD")
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    if (moment(data.date).format("MMM DD") === date) {
                        groups[date].push(data);
                    }
                }
                return groups;
            }, {})
        } else if (noOfDays > 7) {
            let daysLength = Math.trunc(noOfDays / 7)
            groups = refSearchData?.results?.reduce((groups, data) => {
                let startDate, endDate, finalDateRange;
                for (var i = 0; i <= daysLength; i++) {
                    if (i === 0) {
                        startDate = moment(form?.startDate);
                        endDate = moment(startDate).add(6, 'days');
                        finalDateRange = `${startDate.format("L")}-${endDate.format("L")}`;
                    } else if (i > 0) {
                        startDate = moment(endDate).add(1, 'days');
                        if (i === daysLength) {
                            let remainingDays = noOfDays % 7
                            endDate = moment(startDate).add(remainingDays, 'days');
                        } else {
                            endDate = moment(startDate).add(6, 'days');
                        }
                        finalDateRange = `${startDate.format("L")}-${endDate.format("L")}`;
                    }
                    if (!groups[finalDateRange]) {
                        groups[finalDateRange] = [];
                    }
                    if (new Date(data.date).getTime() >= new Date(startDate).getTime() && new Date(data.date).getTime() <= new Date(new Date(moment(endDate).add(1, 'days')).setHours(0, 0, 0, 0)).getTime()) {
                        groups[finalDateRange].push(data);
                    }
                }
                return groups;
            }, {})
        }
        for (const keys in groups) {
            options?.xAxis?.categories?.push(keys);
            options?.series[0]?.data?.push(groups[keys]?.length)
        }
    }

    const handleSubmit = () => {
        if (isInvaild()) {
            return
        }
        // dispatch({type: actionTypes.RESET_REFERENCES})
        setView({
            ...view,
            isLoading: true,
            btnFlag: true,
        })
        callMore= false
        isSubmitClicked = true;
        loadReferenceList()
    }

    const loadReferenceList = () => {
        let requestObject= {}, toDateIndex, fromDateIndex,  daysDiff, isMore = false;
        const scope = form?.selectedScoper && scopers?.data?.length && scopers?.data?.filter((item) => { return item.email_address === form.selectedScoper })
        requestObject = {
            text: form?.keyboardText ? form?.keyboardText : null,
            conversation_type: form?.conversation_type
        }
        if(form?.isExtraFilterAdded) {
            let projectVal = form?.selectedProjects?.length ? form[`selectedProjects`]?.map(function(item) {
                return item['server_value'];
              }) : null
            requestObject[`scoper_email`] =  scope[0]?.email_address,
            requestObject[`projects`] = projectVal?.length ? String(projectVal) : null
            
        }
        const noOfDays = moment(form?.endDate).diff(moment(form?.startDate), 'days')
        if(noOfDays <= 7) {
            startDays = moment(form.startDate).format("MMM DD, YYYY")
            requestObject[`start_time`] = form?.startDate && moment(form.startDate).format();
            requestObject[`end_time`] = form?.endDate && moment(form.endDate).format()
            setView({
                ...view,
                isLoading: true,
                btnFlag: true,
            })
        } else {
            if(form?.endDateIndex && !view?.isLoading && !form?.isViewMoreLoading) {
                setForm({
                    ...form,
                    isViewMoreLoading: true,
                })
            }
            isMore = form?.endDateIndex ? true : false
            toDateIndex =  form?.endDateIndex && !isSubmitClicked ? moment(form.endDateIndex) : moment(form.endDate);
            daysDiff = moment(toDateIndex).diff(moment(form?.startDate), 'days')
            if(daysDiff > 7) {
                callMore= true
                fromDateIndex =   moment(toDateIndex).subtract(6, 'days')
            } else {
                fromDateIndex =   moment(toDateIndex).subtract(daysDiff, 'days')
                callMore = false
            }
            startDays = moment(new Date(fromDateIndex).setHours(0, 0, 0, 0)).format("MMM DD, YYYY")
            requestObject[`start_time`] = fromDateIndex && moment(new Date(fromDateIndex).setHours(0, 0, 0, 0)).format();
            requestObject[`end_time`] = toDateIndex && moment(toDateIndex).format()
        }
        dispatch(searchReferences(axiosReferenceSearchInstance, requestObject, scope[0], isMore, isSubmitClicked)).then(resp => {
            if (resp.status === "success") {
                setView({
                    ...view,
                    isError: false,
                    errorMessage: "",
                    isLoading: false,
                    btnFlag: false,
                })
                setForm({
                    ...form,
                    endDateIndex: callMore ? moment(fromDateIndex).subtract(1, 'days') : null,
                    isViewMoreLoading: callMore && resp?.resLength == 0  ? true :  false,
                    isViewMoreBtnDisable: daysDiff && daysDiff > 7 ? true : false
                })
                isMore = false
                isSubmitClicked = false
            } else {
                setView({
                    ...view,
                    isError: true,
                    errorMessage: "Something went wrong!",
                    isLoading: false,
                    btnFlag: false,
                    endDateIndex: null
                })
            }
        })
    }

    useEffect(()=> {
       if(refSearchData?.results?.length < 10 && form?.endDateIndex && callMore) {
        loadMoreData()
       }
    },[form?.endDateIndex])

    const loadMoreData = () => {
        loadReferenceList()
    }
    const isInvaild = () => {
        let isError = false;;
        let errors = { ...form.errors };
        if (!form.startDate) {
            isError = true
            errors["startDate"] = "Please enter start date";
        } else if (!form.endDate) {
            isError = true
            errors["endDate"] = "Please enter end date";
        }
        setForm({
            ...form,
            errors: errors
        })
        return isError
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
            endDateIndex: null,
        })
    }
    const handleDateChange = (date, name) => {
        let isError = { ...form.errors };
        if (name === "startDate") {
            isError[name] = !date ? "Please enter start date" : "";
        }
        if (name === "endDate") {
            isError[name] = !date ? "Please enter end date" : "";
            date.setHours(23,59,59,0)
        }
        if (name === "startDate" && new Date(date) > new Date(form?.endDate)) {
            isError["endDate"] = "End date must be greater than start date.";
            setForm({
                ...form,
                ["endDate"]: "",
                [name]: date,
                errors: isError
            })

        } else if (name === "endDate" && new Date(date) < new Date(form?.startDate)) {
            isError["startDate"] = "Start date cannot be greater than end date.";
            setForm({
                ...form,
                ["startDate"]: "",
                [name]: date,
                errors: isError
            })
        } else {
            setForm({
                ...form,
                [name]: date,
                errors: isError
            })
        }
    }

    const handleModal = (item) => {
        setView({
            ...view,
            showModal: true,
            modalContent: item
        })
    }

    const closeModal = () => {
        setView({
            ...view,
            showModal: false,
            modalContent: {}
        })
    }

    const handleProjectChanges = (value) => {
        setForm({
            ...form,
            [`selectedProjects`]: value,
        })
    }

    const handleCoversationChange = (e) => {
        setForm({
            ...form,
            [`conversation_type`]: e.target.value,
        })
    }

    const handleFilterRemove = () => {
        setForm({
            ...form,
            [`selectedProjects`]: [],
            [`selectedScoper`] : "",
            [`conversation_type`] : "All",
            [`isExtraFilterAdded`] : false
        })
    }

    const renderModal = () => {
        let finalContents = view?.modalContent?.content?.replaceAll('<br><br>', '<br>');
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
                    <div className="lightGrey mb-2"><span dangerouslySetInnerHTML={{__html:finalContents}}></span></div>
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
                        {view?.modalContent?.people_names?.length ? <span className="lightGrey mb-2"> {view?.modalContent?.people_names?.toString()}</span>
                            : <span className="lightGrey mb-2">-</span>}
                    </div>
                    <div className="d-flex">
                        <span className="primaryGrey">Date:</span>&nbsp;
                        <span className="lightGrey mb-2">{moment(view?.modalContent?.date).format("MMM DD YYYY")}</span>&nbsp; &nbsp;
                        {refSearchData?.scopers && <> 
                        <span className="primaryGrey">Scoper:</span> &nbsp;
                        <span className="lightGrey mb-2">{refSearchData?.scopers?.full_name}</span>
                        </>} 
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <>  
            {view?.showModal && renderModal()}
            <Row className="m-0">
                <Col xs={12} className="m-b-20">
                    <div className="main-heading">All Conversations</div>
                </Col>
            </Row>
            <Row className="m-0 ">
                <Form className="top-header-box p-r-20 p-l-20 " autoComplete="off">
                    <Row className="m-0 ">
                        <Col xs={12} md={4} lg={3} xl={3}>
                            <Form.Group className="mb-3 m-r-10 w-100 position-relative" controlId="formBasicEmail">
                                <Form.Label>From:</Form.Label>
                                <DatePicker name="startDate" selected={form.startDate} onChange={date => handleDateChange(date, "startDate")} className="w-100" dateFormat="MMM dd yyyy" placeholderText={'MMM DD YYYY'} maxDate={new Date()}/>&nbsp;<CalendarSvg className="iconClass" />
                                {form?.errors && form?.errors["startDate"] && <span className="warningText card-body-paragraph">{form.errors["startDate"]}</span>}
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4} lg={3} xl={3}>
                            <Form.Group className="mb-3 m-r-10 w-100 position-relative" controlId="formBasicEmail">
                                <Form.Label>To:</Form.Label>
                                <DatePicker name="endDate" selected={form.endDate} onChange={date => handleDateChange(date, "endDate")} className="w-100" dateFormat="MMM dd yyyy" placeholderText={'MMM DD YYYY'} maxDate={new Date()}/>&nbsp;<CalendarSvg className="iconClass" />
                                {form?.errors && form?.errors["endDate"] && <span className="warningText card-body-paragraph">{form.errors["endDate"]}</span>}
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4} lg={3} xl={3}>
                            <Form.Group className="mb-3 m-r-10 w-100" controlId="formBasicEmail">
                                <Form.Label>Keyboard Search:</Form.Label>
                                <Form.Control name="keyboardText" type="text" placeholder="" value={form.keyboardText} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                        {!form?.isExtraFilterAdded && <Col xs={12} md={4} lg={3} xl={2}>
                            <div
                              className="d-flex justify-content-start w-100 "
                            >
                              <div
                                className="black-box m-r-10 top-margin"
                                onClick={() => setForm({...form, isExtraFilterAdded : true})}
                              >
                                +
                              </div>
                            <Button variant="secondary" className="top-margin" onClick={()=>handleSubmit()} disabled={view?.btnFlag}>Submit</Button>
                            </div>
                        </Col>}
                    </Row>
                    {form?.isExtraFilterAdded && <div className=" m-b-20">
                    <Row className="m-0">
                        <Col xs={12} md={4} lg={3} xl={3}>
                            <Form.Group className="mb-3 m-r-10 w-100" controlId="formBasicEmail">
                                <Form.Label>Scoper:</Form.Label>
                                <Form.Select name="selectedScoper" aria-label="Default select example" className="" onChange={handleOnChange} >
                                    <option key={"-1"} value="">Select scoper</option>
                                    {scopers?.data?.length && scopers?.data?.map((item, idx) => {
                                        return (
                                            <option key={idx} value={item?.email_address}>{item?.full_name}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4} lg={3} xl={3}>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                                <Form.Label>Projects:</Form.Label>
                                <Typeahead
                                    labelKey="display_name"
                                    id="dropdown"
                                    className="typeAhead"
                                    name={`projects`}
                                    onChange={(val)=> handleProjectChanges(val)}
                                    options={projectOptions || []}
                                    placeholder={`Select projects`}
                                    selected={form[`selectedProjects`]}
                                    useCache={false}
                                    multiple
                                />
                                {/* {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>} */}
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4} lg={3} xl={3}>
                            <Form.Group className="mb-3 m-r-10 w-100" controlId="formBasicEmail">
                                <Form.Label>Conversation Type:</Form.Label>
                                <Form.Select name="selectedScoper" aria-label="Default select example" className="" onChange={(val) => handleCoversationChange(val)} >
                                    <option  value="all">All</option>
                                    <option  value="Reference Call">Reference call</option>
                                    <option value="Company Call">Company call</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                       <Col xs={12} md={4} lg={3} xl={2}>
                            <div
                              className="d-flex justify-content-start w-100 "
                            >
                              <div
                                className="black-box m-r-10 top-margin"
                                onClick={() => handleFilterRemove()}
                              >
                                -
                              </div>
                            <Button variant="secondary" className="top-margin" onClick={handleSubmit} disabled={view?.btnFlag}>Submit</Button>
                            </div>
                        </Col> 
                    </Row>
                </div>
                }
                </Form>
                
            </Row>
            {view.isLoading ? <Loader scale={30} message={"Loading Conversations..."} customStyle={"child"} /> : view?.isError ? <CommonError errorMessage={view?.errorMessage} isBlurredRequired={true}/> : refSearchData === null ? <NoFilter /> : <>
                <Row className="m-b-10 mt-4">
                    <Col xs={12}>
                        <div className="d-flex justify-content-end">
                            <span className="filter" style={{ cursor: "pointer" }}><ListViewSvg onClick={() => setView({ viewType: "cardView" })} /><CardViewSvg onClick={() => setView({ viewType: "listView" })} /></span>
                        </div>
                    </Col>
                </Row>
                {view && view?.viewType === "cardView" ? <Row className="m-b-20">
                    {refSearchData?.results?.length ? refSearchData.results.map((item, idex) => {
                        const contents  = item?.content?.replace(/\n|<.*?>/g,'')
                        return (
                            <Col xs={12} md={6} lg={4} className="mb-3">
                                <Card className="p-20 custom-card-style" key={idex} style={{ height: "346px" }} onClick={()=>handleModal(item)}  >
                                    <div className="d-flex justify-content-between ">
                                        <div className="main-title w-75 singleLineTxt">{item?.conversation_type}</div>
                                        {refSearchData?.scopers && <span className="card-body-paragraph" style={{ textAlign: "right" }}>
                                            <div className="lightGrey">Scoper</div>
                                            <div className="">{refSearchData?.scopers?.full_name}</div>
                                        </span>}
                                    </div>
                                    <div className="divider mt-2 mb-3"></div>
                                    <div className="card-body-paragraph mb-2" style={{ height: "100%", overflowY: "overlay" }}>
                                    <div className="primaryGrey mb-2">Projects:</div>
                                        {item?.project?.length ? 
                                            <div className="lightGrey singleLineTxt mb-2">{item?.project?.length ? item?.project?.toString() : null}</div>
                                       : <div className="lightGrey mb-2">-</div>}
                                        <div className="primaryGrey mb-2">Reference:</div>
                                         <div className="lightGrey singleLineTxt mb-2" >{contents}</div>
                                            <div className="primaryGrey mb-2">People Involved:</div>
                                            {item?.people_names?.length ? <div className="lightGrey mb-2">{item?.people_names?.length && item?.people_names?.toString()}</div>
                                         : <div className="lightGrey mb-2">-</div>}
                                        <div className="primaryGrey mb-2">Date:</div>
                                        <div className="lightGrey mb-2">{moment(item?.date).format("MMM DD YYYY")}</div>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }) : <Col xs={12} md={6} lg={4} className="text-center">
                            <Card className="p-20" style={{ height: "300px" }}>
                                No data available to preview
                        </Card>
                        </Col>}
                { form?.isViewMoreBtnDisable ?<>{form?.isViewMoreLoading ? <Col xs={12}>
                    <Loader scale={30} message={"Loading More..."} customStyle={"child"} />
                </Col> : null}<Col xs={12}><Button variant="primary" onClick={loadMoreData} className="w-25" disabled={view?.isLoading}>View More</Button>&nbsp;</Col> </>: null}
                </Row> :
                    <Row className="m-b-20">
                        <Col xs={12} className="m-b-20">
                            <Card className="p-3">
                                <div className="custom-table">
                                    <ul className="table-header">
                                        <li>Conversation Type</li>
                                        <li>Project</li>
                                        <li>Reference</li>
                                        <li>People Involved</li>
                                        <li>Scoper</li>
                                        <li>Date</li>
                                    </ul>
                                    <ul className="table-body">
                                        {refSearchData?.results?.length ? refSearchData?.results?.map((item, indx) => {
                                            const contents  = item?.content?.replace(/\n|<.*?>/g,'');
                                            return (<>
                                                <li key={indx} className="custom-table-body" onClick={()=>handleModal(item)}>
                                                    <div className="singleLineTxt" style={{ cursor: "pointer" }}>{item?.conversation_type} </div>
                                                    <div className="singleLineTxt" style={{ cursor: "pointer" }}>{item?.project? String(item?.project) : "-"} </div>
                                                    <div className=" singleLineTxt " style={{ cursor: "pointer" }}>{contents}</div>
                                                    <div className=" singleLineTxt " style={{ cursor: "pointer" }}>{item?.people_names?.length ? String(item?.people_names) : "-"}</div>
                                                    <div className="">{refSearchData?.scopers?.full_name ? refSearchData?.scopers?.full_name : "-"}</div>
                                                    <div>{moment(item?.date).format("MMM DD YYYY")}</div>
                                                </li>
                                            </>)
                                        }) : <div className="mt-3">  No data available to preview</div>}
                                    </ul>
                                </div>
                            </Card >
                        </Col>
                        {form?.isViewMoreBtnDisable ?<>{form?.isViewMoreLoading ? <Col xs={12}>
                    <Loader scale={30} message={"Loading ..."} customStyle={"child"} />
                </Col> : null}<Col xs={12}><Button variant="primary" onClick={loadMoreData} className="w-25" >View More</Button>&nbsp;</Col> </>: null}
                    </Row>
                }
                <Row className="m-b-0">
                    <Col md={12}>
                        <div className="main-heading lightGrey">Analytics</div>
                    </Col>
                    <hr />
                    {refSearchData?.results?.length ? <>
                        <Col xs={12} md={6} lg={6}>
                            <Card>
                                <div className="lightGrey main-title mb-3 p-l-15">References WoW</div>
                                <Card.Body className="p-10">
                                    {<Chart options={options} highcharts={Highcharts} />}
                                </Card.Body>
                            </Card>
                        </Col>
                    </> :
                        <Col xs={12} md={6} lg={4} className="text-center">
                            <Card className="p-20" style={{ height: "300px" }}>
                                No data available to preview
                        </Card>
                        </Col>
                        }
                </Row>
            </>}

        </>
    )
}
export default References;