import React, { useEffect, useState } from "react";
import { Button, Modal, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeUnderScoreAndCapitalize } from "../../utils/removeUnderScoreAndCapitalize";
import { ReactComponent as DeleteSvg } from "../../assets/images/icon_svg/delete.svg";
import * as actionTypes from '../../store/actionTypes';
import { axiosAlexaMetricsInstance, axiosLinkedInMetricsInstance, axiosSpyfuMetricsInstance } from "../../config/appConfig/axiosInstance";
import { getSourceMetrics, submitFilterMetrics } from "../../store/actions";





const source = [{ name: "LinkedIn", id: 1, dataType: "linkedin", url: '/linkedin-metrics' }, { name: "Spyfu", id: 2, dataType: "spyfu", url: '/spyfu-metrics' }, { name: "Alexa", id: 3, dataType: "alexa", url: '/alexa-metrics' }];
const filter_ops = ["EQUAL_TO", "GREATER_THAN", "LESS_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN_OR_EQUAL_TO"]

export const AddFilterModal = ({ onClose, modalOpen }) => {
  const dispatch = useDispatch();
  const [filterResults, setFilteredObject] = useState({
    totalItem: [],
    filteredItem: [],
    itemsPerPage: 20,
    currentPage: null,
    offset: "",
    filterSummary: []
  })

  const [isOpen, setIsOpen] = useState(modalOpen);
  const [data, setData] = useState([
    {
      id: Math.round(Math.random() * 100),
      type: "type",
      metricsVal: [{ id: 1, mertics: "metrics", value: "value" }],
    },
  ]);
  const [page, setPage] = useState({
    view: "cardView",
    isLoading: false,
    isError: false,
    errorMessage: "",
    btnFlag: false,
  })

  const addMetricsVal = (index) => {
    let addMetrics = [...filterData[index].metricsVal]
    addMetrics = [
      ...addMetrics,
      { id: new Date().getTime(), selectedMetrics: "", selectedMetricsType: "", value: "", selectedMetricsError: "", selectedValueError: "" },
    ]
    filterData[index].metricsVal = addMetrics
    setFilerData([...filterData])
  }

  const [linkedinMetrics, spyfuMetrics, alexaMetrics, filterSearchData] = useSelector(({ discoveryReducer }) => [discoveryReducer.linkedinData, discoveryReducer.spyfuData, discoveryReducer.alexaData, discoveryReducer.filterSearchData]);

  const deleteMetrics = (filterIndex, metricsIndex, metricsId) => {
    let daa = [...filterData[filterIndex].metricsVal]
    let daaa = daa.filter((ele, idx) => {
      return idx !== metricsIndex
    })
    filterData[filterIndex].metricsVal = [...daaa]
    setFilerData([...filterData])
  }
  const [selectedSource, setSelectedSource] = useState(["linkedin"])

  // const addNewFilter = () => {
  //   setData([
  //     ...data,
  //     {
  //       id: Math.random() * 100,
  //       type: `type ${Math.random() * 100}`,
  //       metricsVal: [{ id: 1, mertics: "metrics", value: "value" }],
  //     },
  //   ]);
  // };

  const addNewFilter = () => {
    let finalFilteredSource = source?.filter((item) => {
      return !selectedSource?.includes(item?.dataType)
    })
    setFilerData([
      ...filterData,
      {
        id: new Date().getTime(),
        dataType: finalFilteredSource[0]?.dataType,
        filterOps: "EQUAL_TO",
        metricsVal: [{ id: new Date().getTime(), selectedMetrics: ``, selectedMetricsType: "", value: "", selectedMetricsError: "", selectedValueError: "", }],
        sources: finalFilteredSource,
      },
    ])
    setSelectedSource([...selectedSource, finalFilteredSource[0].dataType])
  }
  const [filterData, setFilerData] = useState([
    {
      id: new Date().getTime(),
      dataType: source[0]?.dataType,
      filterOps: "EQUAL_TO",
      metricsVal: [{ id: new Date().getTime(), selectedMetrics: ``, selectedMetricsType: "", value: "", selectedMetricsError: "", selectedValueError: "", }],
      sources: source,
    },
  ])
  const handleClose = () => {
    setIsOpen(false);
    onClose(!isOpen);
  };

  const hanldeSourceChange = (val, index) => {
    let newFilter = filterData
    newFilter[index].dataType = val
    newFilter[index].metricsVal = [{ id: new Date().getTime(), selectedMetrics: "", selectedMetricsType: "", value: "" }]
    let finalFilteredData = newFilter?.filter((item, indx) => {
      return indx <= index
    })
    setFilerData([
      ...finalFilteredData
    ])
    let arrayObj = selectedSource
    arrayObj[index] = val;

    let finalFilteredSource = arrayObj?.filter((item, indx) => {
      return indx <= index
    })
    setSelectedSource([...finalFilteredSource])
  }

  useEffect(() => {
    return () => {
      dispatch({ type: actionTypes.RESET_FILTER })
    }
  }, [])

  useEffect(() => {
    if (Object.keys(filterSearchData)) {

      let tableBody = []
      for (let keys in filterSearchData) {
        filterSearchData[keys]?.results?.map((curr) => {
          // let newItem = [`${keys}`]
          let newItem = []
          for (let itemKeys in curr) {
            newItem.push(curr[itemKeys])
          }
          tableBody.push(newItem)
        })
      }

      let initial = tableBody.slice(0, 20);
      let offsets =
        1 + "-" + filterResults?.itemsPerPage + " of " + tableBody?.length;
      setFilteredObject({
        ...filterResults,
        totalItem: tableBody,
        filteredItem: initial,
        offset: offsets,
      })
    }
  }, [filterSearchData])

  useEffect(() => {
    let lastElement = selectedSource[selectedSource?.length - 1]
    let axiosIns = lastElement === "linkedin" ? axiosLinkedInMetricsInstance : lastElement === "spyfu" ? axiosSpyfuMetricsInstance : lastElement === "alexa" ? axiosAlexaMetricsInstance : null
    let continueApiCall = ((lastElement === "linkedin" && Object.keys(linkedinMetrics).length == 0) || (lastElement === "spyfu" && Object.keys(spyfuMetrics).length == 0) || (lastElement === "alexa" && Object.keys(alexaMetrics).length == 0))
    if (axiosIns && continueApiCall) {
      dispatch(getSourceMetrics(axiosIns, lastElement))
    }
  }, [selectedSource])

  const hanldeMetricsValueChange = (val, metricsIndex, filterIndex) => {
    let newArrayObj = [...filterData]
    newArrayObj[filterIndex].metricsVal[metricsIndex].value = val;
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedValueError = val ? "" : "Please enter value";
    setFilerData([...newArrayObj])
  }
  const handleKeyDown = (e, type) => {
    if (e.key === '.' && type === "int") {
      e.preventDefault();
    }
  }
  const hanldeMetricsChange = (val, metricsIndex, filterIndex, dropDownArray) => {
    let newArrayObj = [...filterData]
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedMetrics = val;
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedMetricsError = val ? "" : "Please select one";
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedMetricsType = dropDownArray[val];
    setFilerData([...newArrayObj])
  }
  const handleSubmit = () => {
    if (isInvalid()) {
      return
    }

    let getSubmissionData = filterData?.reduce((group, curr) => {
      if (!group[curr?.dataType]) {
        group[curr?.dataType] = []
      }
      if (group[curr?.dataType]) {
        curr?.metricsVal?.forEach((item) => {
          let newOb = {
            [item.selectedMetrics]: item.value
          }
          newOb[`filter_ops`] = curr?.filterOps
          group[curr?.dataType].push(newOb)
        })
      }
      return group;
    }, {})

    setFilteredObject({
      ...filterResults,
      filterSummary: JSON.parse(JSON.stringify(filterData))
    })
    setPage({
      ...page,
      isLoading: true,
    })
    dispatch(submitFilterMetrics(getSubmissionData)).then(res => {
      if (res.status === "success") {
        handleClose()
        setPage({
          ...page,
          isLoading: false,
          isError: false,
          errorMessage: "",
          btnFlag: false,
        })
      } else {
        setPage({
          ...page,
          isLoading: false,
          isError: true,
          errorMessage: res?.errorMessage || "Something went wrong!",
          btnFlag: false,
        })
      }
    })
  }

  const removeFilter = (id, indx) => {
    let finalFilteredData = filterData?.filter((item, indx) => {
      return item.id != id
    })
    setFilerData([
      ...finalFilteredData
    ])
    let finalFilteredSource = selectedSource?.filter((item, index) => {
      return index != indx
    })
    setSelectedSource([...finalFilteredSource])
  }

  const isInvalid = () => {
    let hasError = false
    let newArrayObj = [...filterData]
    newArrayObj?.forEach(filter => {
      filter?.metricsVal?.forEach(metric => {
        if (!metric?.selectedMetrics) {
          metric[`selectedMetricsError`] = "Please select one";
          hasError = true
        }
        if (!metric?.value) {
          metric[`selectedValueError`] = "Please enter value";
          hasError = true
        }
      })
    })
    setFilerData([...newArrayObj])
    return hasError
  }
  return (
    <Modal
      show={modalOpen}
      onHide={onClose}
      dialogClassName="custom-modal"
      aria-labelledby=""
      size="lg"
    >
      <Modal.Header className="custom-modal-header">
        <Modal.Title className="main-title">Set Filters</Modal.Title>
        <Modal.Title>
          <Button onClick={addNewFilter}>Add Source</Button>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="custom-modal-body">
        {/* {data.map((item, index) => {
          return (
            <div className=" m-b-20">
              <Col xs={12} className=" ml-10 d-flex">
                <Col md={5}>
                  <div className="m-b-30">
                    <Form.Group
                      className="mb-3 m-r-10 w-100"
                      controlId="formBasicEmail"
                    >
                      <Form.Label>Source :</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        className=""
                      >
                        <option>Linkedin</option>
                        <option value="1">Linkedin</option>
                        <option value="2">Spyfu</option>
                        <option value="3">Alexa</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Col>
                <Col md={7}>
                  {item.metricsVal.map((ele, indx) => {
                    return (
                      <Row>
                        <Col
                          md={2}
                          className="d-flex align-items-center m-t-19"
                        >
                          {indx >= 1 && (
                            <Button
                              variant="none"
                              className="black-box m-r-10"
                              onClick={() => deleteMetrics(index, ele.id)}
                            >
                              x
                            </Button>
                          )}
                        </Col>
                        <Col md={8}>
                          <div className="m-b-30">
                            <Form.Group
                              className="mb-3 m-r-10 w-100"
                              controlId="formBasicEmail"
                            >
                              <Form.Label>{`Metric - ${
                                indx + 1
                              } :`}</Form.Label>
                              <Form.Select
                                aria-label="Default select example"
                                className=""
                              >
                                <option>Location</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </Col>
                        {data[index]?.metricsVal?.length == indx + 1 && (
                          <Col
                            md={2}
                            className="m-t-27 d-flex align-items-center"
                          >
                            <div
                              className="black-box m-r-10 "
                              onClick={() => addMetricsVal(index)}
                            >
                              +
                            </div>
                          </Col>
                        )}
                      </Row>
                    );
                  })}
                </Col>
              </Col>
            </div>
          );
        })} */}
        {filterData?.map((item, index) => {
          let merticsArray = item?.dataType === "linkedin" ? linkedinMetrics : item?.dataType === "spyfu" ? spyfuMetrics : item?.dataType === "alexa" ? alexaMetrics : [];
          return (
            <div className=" m-b-20" style={{ boxShadow: '0px 0px 5px 2px lightgrey', padding: 10, position: 'relative', borderRadius: '4px' }}>
              <Row >
                {index == filterData.length - 1 && index > 0 && <div className="ml-1 cursor-pointer iconboxcircle position-absolute" style={{ right: "10px", top: "10px" }} onClick={() => removeFilter(item.id, index)}><DeleteSvg /></div>}
                <Col xs={12} md={3}>
                  <Form.Group
                    className="mb-3 m-r-10 w-100"
                    controlId="formBasicEmail"
                  >
                    <Form.Label>Source</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      className=""
                      onChange={(e) => hanldeSourceChange(e.target.value, index)}
                    >
                      {item?.sources?.length && item?.sources?.map((item) => {
                        return (
                          <option value={item.dataType}>{item?.name}</option>
                        )
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={9}>
                  <Row>
                    <Col xs={12} md={{ offset: 1, span: 8 }}>
                      <Form.Group
                        className="mb-3 m-r-10 w-100"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Filter Operations</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          className=""
                          onChange={(e) => hanldeFilterChange(e.target.value, index)}
                        >
                          {filter_ops?.map((filterData) => {
                            let filter = removeUnderScoreAndCapitalize(filterData)
                            return (
                              <option value={filterData} className="text-capitalize">{filter}</option>
                            )
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {item?.metricsVal?.map((ele, indx) => {
                    return (
                      <Row>
                        <Col md={1} className="d-flex align-items-center">
                          {indx >= 1 && (
                            <Button
                              variant="none"
                              className="black-box m-r-10"
                              onClick={() => deleteMetrics(index, indx, ele.id)}
                              style={{ marginTop: `${(ele?.selectedMetricsError || ele?.selectedValueError) ? "-8px" : "8px"}` }}
                            >
                              x
                            </Button>
                          )}
                        </Col>
                        <Col md={4}>
                          {/* <div className="m-b-30"> */}
                          <Form.Group
                            className="mb-3 m-r-10 w-100"
                            controlId="formBasicEmail"
                          >
                            <Form.Label>{`Metric - ${indx + 1}`}</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              className=""
                              onChange={(e) => hanldeMetricsChange(e.target.value, indx, index, merticsArray)}
                              value={ele?.selectedMetrics}
                            >
                              <option value="">Select One</option>
                              {Object.keys(merticsArray)?.map((elem) => {
                                let metricElem = removeUnderScoreAndCapitalize(elem)
                                return (
                                  <option value={elem}>{metricElem}</option>
                                )
                              })}
                            </Form.Select>
                            {ele?.selectedMetricsError && <span className="warningText">{ele?.selectedMetricsError}</span>}
                          </Form.Group>
                          {/* </div> */}
                        </Col>
                        <Col md={4}>
                          <Form.Group
                            className=" m-r-10 w-100"
                            controlId="formBasicEmail"
                          >
                            <Form.Label>{`Value - ${indx + 1}`}</Form.Label>
                            <Form.Control
                              aria-label="Default select example"
                              className=""
                              type={`${ele?.selectedMetricsType == "int" || ele?.selectedMetricsType == "float" ? "number" : "string"}`}
                              value={ele?.value}
                              onChange={(e) => hanldeMetricsValueChange(e.target.value, indx, index)}
                              onKeyPress={(e) => handleKeyDown(e, ele?.selectedMetricsType)}
                            />
                            {ele?.selectedValueError && <span className="warningText">{ele?.selectedValueError}</span>}
                          </Form.Group>
                          {/* </div> */}
                        </Col>
                        {filterData[index]?.metricsVal?.length == indx + 1 && (
                          <Col
                            md={3}
                            className="d-flex align-items-center"
                          >
                            <div
                              className="d-flex justify-content-start w-100"
                              style={{ marginTop: `${(ele?.selectedMetricsError || ele?.selectedValueError) ? "-8px" : "8px"}` }}
                            >
                              <div
                                className="black-box m-r-10"
                                onClick={() => addMetricsVal(index)}
                              >
                                +
                              </div>
                              {/* {index == filterData.length - 1 && filterData[index]?.metricsVal?.length - 1 == indx && <div className="black-box w-50" onClick={() => handleSubmit()} disabled={page?.btnFlag}>Submit</div>} */}
                            </div>
                          </Col>
                        )}
                      </Row>
                    )
                  })}
                </Col>
              </Row>
            </div>
          )
        })}
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button variant="light" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleSubmit}>Apply</Button>
      </Modal.Footer>
    </Modal >
  );
};
