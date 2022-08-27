import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Button, Col, Form, Card, Table } from 'react-bootstrap';

import {axiosSpyfuMetricsInstance, axiosAlexaMetricsInstance, axiosLinkedInMetricsInstance} from "../../config/appConfig/axiosInstance";
import {getSourceMetrics, submitFilterMetrics} from "../../store/actions";
import Loader from "../../commonComponents/Loader/Loader";
import NoFilter from "../../commonComponents/NoFilter/NoFilter";
import CommonError from "../../commonComponents/CommonError/CommonError";
import {removeUnderScoreAndCapitalize} from "../../utils/removeUnderScoreAndCapitalize";
import {removeUnderScore} from "../../utils/removeUnderScore";
import Paginations from "../../commonComponents/Pagination/Pagination";

import { ReactComponent as DeleteSvg } from "../../assets/images/icon_svg/delete.svg";
import { ReactComponent as ListViewSvg } from '../../assets/images/icon_svg/listView.svg';
import { ReactComponent as CardViewSvg } from '../../assets/images/icon_svg/cardView.svg';

import { ReactComponent as AlexaSvg } from "../../assets/images/icon_svg/alexa.svg";
import { ReactComponent as SpyfuSvg } from '../../assets/images/icon_svg/spyfu.svg';
import { ReactComponent as LinkedInSvg } from '../../assets/images/icon_svg/linkedin.svg';

import * as actionTypes from '../../store/actionTypes';
import "./discovery.scss";


const source = [{name: "LinkedIn", id: 1, dataType: "linkedin", url: '/linkedin-metrics'},{name: "Spyfu", id: 2, dataType: "spyfu", url: '/spyfu-metrics'}, {name: "Alexa", id: 3, dataType: "alexa", url: '/alexa-metrics'}];
const filter_ops = ["EQUAL_TO", "GREATER_THAN", "LESS_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN_OR_EQUAL_TO"]

const Discovery = () => {
  const dispatch = useDispatch();
  const [filterResults, setFilteredObject] = useState({
    totalItem: [],
    filteredItem: [],
    itemsPerPage : 20,
    currentPage: null,
    offset: "",
    filterSummary: []
  })

  const [linkedinMetrics, spyfuMetrics, alexaMetrics, filterSearchData] = useSelector(({ discoveryReducer }) => [discoveryReducer.linkedinData, discoveryReducer.spyfuData, discoveryReducer.alexaData, discoveryReducer.filterSearchData ]);
  
  useEffect(()=>{
   return () => {
      dispatch({type: actionTypes.RESET_FILTER})
   }
  },[])

  useEffect(()=>{
    if(Object.keys(filterSearchData)){

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
        totalItem : tableBody,
        filteredItem: initial,
        offset: offsets,
      })
    }
   },[filterSearchData])

   const handlePageChange = (pageObj, currentPage, offsets) => {
    setFilteredObject({
      ...filterResults,
      filteredItem: pageObj,
      currentPage: currentPage,
      offset: offsets,
    });
  };
 
  const [page, setPage] = useState({
      view: "cardView",
      isLoading: false,
      isError: false,
      errorMessage: "",
      btnFlag: false,
  })
  const [selectedSource, setSelectedSource] = useState(["linkedin"])
  const [filterData, setFilerData] = useState([
    {
      id: new Date().getTime(),
      dataType: source[0]?.dataType,
      filterOps: "EQUAL_TO",
      metricsVal: [{ id: new Date().getTime(), selectedMetrics:``, selectedMetricsType: "", value:"", selectedMetricsError: "", selectedValueError: "", }],
      sources : source,
    },
  ])
  useEffect(()=>{
    let lastElement = selectedSource[selectedSource?.length - 1]
    let axiosIns = lastElement === "linkedin" ? axiosLinkedInMetricsInstance : lastElement === "spyfu" ? axiosSpyfuMetricsInstance :  lastElement === "alexa" ? axiosAlexaMetricsInstance : null
    let continueApiCall = ((lastElement === "linkedin" && Object.keys(linkedinMetrics).length == 0) || (lastElement === "spyfu" && Object.keys(spyfuMetrics).length == 0) || (lastElement === "alexa" &&  Object.keys(alexaMetrics).length == 0) )
    if(axiosIns && continueApiCall) {
      dispatch(getSourceMetrics(axiosIns,lastElement))
    }
  },[selectedSource])
 
  const addNewFilter = () => {
    let finalFilteredSource = source?.filter((item)=>{
      return  !selectedSource?.includes(item?.dataType) 
    })
    setFilerData([
      ...filterData,
      {
        id: new Date().getTime(),
        dataType: finalFilteredSource[0]?.dataType,
        filterOps: "EQUAL_TO",
        metricsVal: [{ id: new Date().getTime(), selectedMetrics:``, selectedMetricsType: "", value:"",selectedMetricsError: "", selectedValueError: "",  }],
        sources : finalFilteredSource,
      },
    ])
    setSelectedSource([...selectedSource, finalFilteredSource[0].dataType])
  }

  const addMetricsVal = (index) => {
    let addMetrics = [...filterData[index].metricsVal]
    addMetrics = [
      ...addMetrics,
      { id: new Date().getTime(), selectedMetrics:"", selectedMetricsType: "", value:"", selectedMetricsError: "", selectedValueError: ""},
    ]
    filterData[index].metricsVal = addMetrics
    setFilerData([...filterData])
  }


  const hanldeMetricsChange = (val, metricsIndex, filterIndex, dropDownArray) => {
    let newArrayObj = [...filterData]
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedMetrics = val;
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedMetricsError = val ? "" : "Please select one";
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedMetricsType = dropDownArray[val];
    setFilerData([...newArrayObj])
  }
 
  const hanldeMetricsValueChange = (val, metricsIndex, filterIndex) => {
    let newArrayObj = [...filterData]
    newArrayObj[filterIndex].metricsVal[metricsIndex].value = val;
    newArrayObj[filterIndex].metricsVal[metricsIndex].selectedValueError = val ? "" : "Please enter value";
    setFilerData([...newArrayObj])
  }

  const isInvalid = () => {
    let hasError = false
    let newArrayObj = [...filterData]
    newArrayObj?.forEach(filter=>{
      filter?.metricsVal?.forEach(metric=>{
          if(!metric?.selectedMetrics ){
            metric[`selectedMetricsError`] = "Please select one";
            hasError = true
          }
          if(!metric?.value){
            metric[`selectedValueError`] = "Please enter value";
            hasError = true
          }
      })
    })
    setFilerData([...newArrayObj])
    return hasError
  }

  const deleteMetrics = (filterIndex,metricsIndex, metricsId) => {
    let daa = [...filterData[filterIndex].metricsVal]
    let daaa = daa.filter((ele, idx) => {
      return idx !== metricsIndex
    })
    filterData[filterIndex].metricsVal = [...daaa]
    setFilerData([...filterData])
  }
  
  const removeFilter = (id, indx) => {
    let finalFilteredData = filterData?.filter((item, indx)=>{
      return  item.id != id
    })
    setFilerData([
      ...finalFilteredData
    ])
    let finalFilteredSource = selectedSource?.filter((item, index)=>{
      return  index != indx
    })
    setSelectedSource([...finalFilteredSource])
  }

  const hanldeSourceChange = (val, index) => {
    let newFilter = filterData
    newFilter[index].dataType = val
    newFilter[index].metricsVal  = [{ id: new Date().getTime(), selectedMetrics:"", selectedMetricsType: "",  value:"" }]
    let finalFilteredData = newFilter?.filter((item, indx)=>{
      return  indx <= index
    })
    setFilerData([
      ...finalFilteredData
    ])
    let arrayObj = selectedSource
    arrayObj[index] = val;

    let finalFilteredSource = arrayObj?.filter((item, indx)=>{
      return  indx <= index
    })
    setSelectedSource([...finalFilteredSource])
  }

  const handleSubmit = () => {
    if(isInvalid()){
      return
    }

    let getSubmissionData = filterData?.reduce((group, curr)=>{
      if(!group[curr?.dataType]) {
        group[curr?.dataType] = []
      }
      if(group[curr?.dataType] ) {
        curr?.metricsVal?.forEach((item)=> {
          let newOb = {
            [item.selectedMetrics]: item.value
          }
          newOb[`filter_ops`] = curr?.filterOps
          group[curr?.dataType].push(newOb)
        })
      }
      return group;
    },{})

    setFilteredObject({
      ...filterResults,
      filterSummary: JSON.parse(JSON.stringify(filterData))
    })
    setPage({
      ...page,
      isLoading: true,
    })
    dispatch(submitFilterMetrics(getSubmissionData)).then(res=>{
      if(res.status === "success") {
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

  const hanldeFilterChange = (val, filterIndex) => {
    let newArrayObj = [...filterData]
    newArrayObj[filterIndex].filterOps = val;
    setFilerData([...newArrayObj])
  }

  const renderSummary = () => {
    return filterResults?.filterSummary?.map((item)=> {
      return (
        <Row className="m-b-10">
          <Col xs={3}>Source : {item?.dataType}</Col>
          <Col xs={9} className="flex-wrap">
              {item?.metricsVal?.map((metric, indx) => {
                let metricsName = removeUnderScore(metric?.selectedMetrics)
                return (
                  <Row className="">
                    <Col xs={4}>{`Metrics - ${indx + 1}:  ${metricsName}`}</Col>
                    <Col xs={8} >{`Value: ${metric?.value}`}</Col>
                  </Row>
                )
              })}
          </Col>
        </Row>
      )
    })
  }

  const renderHeader = () => {
    let filterResult = Object.keys(filterSearchData).length > 0  && filterSearchData
    // let headersArr = ["source"]
    let headersArr = []
    for (let keys in filterResult){
      filterResult[keys]?.results?.map((curr) => {
        for (let itemKeys in curr) {
          let name = removeUnderScore(itemKeys)
            if(!headersArr.includes(name)){
              headersArr.push(name)
            }
        }
      })
    }
    return headersArr?.map(headerItem=>{
      return(
      <th className="text-center text-capitalize">{headerItem}</th>
      )
    })
  }

  const renderBody = () => {
    return filterResults?.filteredItem?.map((headerItem)=>{
        return <tr>
          {headerItem?.map((itm)=>{
            let item = typeof itm === "number" && itm > 0 &&  itm % 1 !== 0 ? itm?.toFixed(3) : itm
            return <td className="text-center">{item ? item : "-" }</td>
          })}
        </tr>
    })
  }

  const renderCardView = () => {
    let filterResult = Object.keys(filterSearchData) && filterSearchData
    let tableBody = []
    for (let keys in filterResult) {
      filterResult[keys]?.results?.map((curr) => {
        let obj = {
          "source": keys,
          ...curr,
        }
        tableBody.push(obj)
      })
    }
    let groups = tableBody?.reduce((groups, current) => {
      if (!groups[current?.domain]) {
        groups[current?.domain] = []
      }
      if (groups[current?.domain]) {
        groups[current?.domain].push(current)
      }
      return groups
    }, {})

    if( Object.entries(groups).length === 0) {
      return (
        <div className="main-paragraph">No data available</div>
      )
    }

    return Object.entries(groups)?.map(([key, value], index) => {
      let url = key;
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      return <Row className="m-b-20" key={`filterkey-${index}`}>
        <Col>
          <Card>
            <div className="singleLineTxt">
              <a
                className="primaryGrey mb-2"
                href={url}
                target="_blank"
              >
                {key}
              </a>
            </div>
            <hr />
            <Row className="m-0">
              {renderInnerValue(groups[key])}
            </Row>
          </Card>
          </Col>
      </Row>
    })
  }

  const renderInnerValue = (innerArray) => innerArray?.map((item) => {
    return <Col xs={12} md={6} lg={4} className="mb-5 ">
      <div className="filter-box mr-2 ">
        {item?.source === "linkedin" ? <span><LinkedInSvg style={{marginRight: "4px"}}/> Linkedin Stats</span> : item?.source === "spyfu" ? <span><SpyfuSvg style={{marginRight: "4px"}}/> Spyfu Stats</span> : item?.source === "alexa" ? <span><AlexaSvg style={{marginRight: "4px"}}/> Alexa Stats</span> : null }
        <hr/>
        {Object.entries(item).map(([innerKey], index) => {
          return (
            <div xs={4} key={`filterval-${index}`} className="innerStyle">
              {innerKey != "source" && <>
              <span className="primaryGrey">{innerKey}:</span>
              <span className="lightGrey " style={{ cursor: "pointer" }}>{item[innerKey]? " " + item[innerKey] : " -"}</span>
              </>}
            </div>
          )
        })}
      </div>
    </Col>
  })

  const handleCSVDownload = () => {
    let filterResult = Object.keys(filterSearchData) && filterSearchData
    let items = []
    for (let keys in filterResult) {
      filterResult[keys]?.results?.map((curr) => {
        let obj = {
          "source": keys,
          ...curr,
        }
        items.push(obj)
      })
    }
    let csv
    // Loop the array of objects
    for (let row = 0; row < items.length; row++) {
      let keysAmount = Object.keys(items[row]).length
      let keysCounter = 0
      // If this is the first row, generate the headings
      if (row === 0) {
   
        // Loop each property of the object
        for (let key in items[row]) {
        
          // This is to not add a comma at the last cell
          // The '\r\n' adds a new line
          csv += key + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
          keysCounter++
        }
      } else {
        for (let key in items[row]) {
          csv += items[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
          keysCounter++
        }
      }
      keysCounter = 0
    }

    // Once we are done looping, download the .csv by creating a link
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv.replaceAll("undefined","")));
    link.setAttribute('download', 'yourfile.csv');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()
  }

  const handleKeyDown = (e, type) => {
    if (e.key === '.' && type === "int") {
      e.preventDefault();
    }
  }

  return (
    <>
      <Row className="m-b-30">
        <Col className="m-b-20" xs={12}>
          <div className="main-heading m-l-23">Discovery</div>
        </Col>
        <Col className="m-t-40" md={12}>
          <div className="d-flex justify-content-between">
            <div className="main-title m-b-10">Set your filter</div>
            <Button
              variant="primary"
              onClick={addNewFilter}
              disabled={filterData.length >= 3 ? true : false}
            >
              Add Filter
            </Button>
          </div>
        </Col>

        {filterData?.map((item, index) => {
          let merticsArray = item?.dataType === "linkedin" ? linkedinMetrics : item?.dataType === "spyfu" ? spyfuMetrics : item?.dataType === "alexa" ? alexaMetrics : [];
          return (
            <div className=" m-b-20">
              <Row  className="top-header-box ml-10 d-flex m-0 position-relative">
              {index == filterData.length - 1 && index > 0 && <div className="ml-1 cursor-pointer iconboxcircle position-absolute" style={{ right: "-10px", top: "-8px" }} onClick={() => removeFilter(item.id, index)}><DeleteSvg /></div>}
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
                <Col xs={12} md={{offset:1, span:8}}>
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
                        let filter  = removeUnderScoreAndCapitalize(filterData)
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
                              onClick={() => deleteMetrics(index, indx,ele.id)}
                              style={{ marginTop: `${(ele?.selectedMetricsError || ele?.selectedValueError) ? "-8px": "8px"}` }}
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
                                onChange={(e) => hanldeMetricsChange(e.target.value,indx,index, merticsArray)}
                                value={ele?.selectedMetrics}
                              >
                                <option value="">Select One</option>
                                {Object.keys(merticsArray)?.map((elem) => {
                                  let metricElem  = removeUnderScoreAndCapitalize(elem)
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
                                type={`${ele?.selectedMetricsType == "int" || ele?.selectedMetricsType == "float" ? "number" : "string" }`}
                                value={ele?.value}
                                onChange={(e) => hanldeMetricsValueChange(e.target.value,indx,index)}
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
                              style={{ marginTop: `${(ele?.selectedMetricsError || ele?.selectedValueError) ? "-8px": "8px"}` }}
                            >
                              <div
                                className="black-box m-r-10"
                                onClick={() => addMetricsVal(index)}
                              >
                                +
                              </div>
                              {index == filterData.length - 1 && filterData[index]?.metricsVal?.length-1 == indx && <div className="black-box w-50" onClick={()=>handleSubmit()} disabled={page?.btnFlag}>Submit</div>}
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
      </Row>
      {page.isLoading ? <Loader scale={30} message={"Loading ..."} customStyle={"child"} /> : page?.isError ? <CommonError errorMessage={page?.errorMessage} isBlurredRequired={true}/> : filterSearchData && Object.keys(filterSearchData).length == 0 ? <NoFilter /> : <>
      <Row className="m-b-40">
        <Col xs={12}>
            <div className="summaryBox ">
              <div className="main-paragraph"><b>Your filter Summary</b></div>
              <hr/>
              <Row>
                {renderSummary()}
              </Row>
            </div>
            
        </Col>
      </Row>
      <Row className="m-b-10">
        <Col xs={12}>
          <div className="d-flex justify-content-between">
            <span className="main-title">Your filter results</span>
            <span>
              <Button
                variant="light"
                className="m-r-6"
                style={{ marginRight: '12px' }}
                onClick={handleCSVDownload}
                disabled={filterResults?.filteredItem?.length ? false : true}
              >
                Download as.csv
              </Button>
              <span className="filter" style={{cursor: "pointer"}}>
                <ListViewSvg onClick={() => setPage({...page, view: 'cardView'})} />
                <CardViewSvg onClick={() => setPage({...page, view: 'listView'})} />
              </span>
            </span>
          </div>
        </Col>
      </Row>
      {page && page?.view === 'cardView' ? <>{renderCardView()}</> : <Row className="m-0">
          <Col xs={12} className="p-0">
          {filterResults?.filteredItem?.length === 0 ? <div>No data available</div> : <Card className="p-3 m-b-20">
            <div className="custom-table-filters">
              <Table responsive>
                  <thead>
                    <tr>
                    {renderHeader()}
                    </tr>
                  </thead>
                  <tbody>
                  {renderBody()}
                  </tbody>
              </Table>
            </div>
            </Card>}
            {filterResults?.filteredItem?.length && page?.view === 'listView' ? (
            <Row className="m-0">
              <Col className="d-flex justify-content-center align-items-center pagination-box p-l-20 p-r-20 flex-wrap">
                {/* <span className="d-flex justify-content-center align-items-center">
                  <span className="m-r-10">Page: </span>
                  <Form.Control
                    className="custom-pagination-input ml-2"
                    name="keyboardText"
                    type="text"
                    value={pipelineForm?.currentPage}
                    disabled
                  />
                </span> */}
                <span className="mb-2 mt-2">
                  <Paginations
                    itemsPerPage={20}
                    items={filterResults?.totalItem}
                    handleCurrent={handlePageChange}
                    currentPageInput={filterResults?.currentPage}
                  />
                </span>
                <span
                  className="d-flex justify-content-center align-items-center"
                  style={{ minWidth: "180px" }}
                >
                  <span className="m-r-10">{filterResults?.offset}</span>
                  {/* <Form.Select
                    aria-label="Default select example"
                    className="per-page-item"
                    onChange={handlePerPageItem}
                    disabled={Number(pipelineForm?.currentPage) > 1}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </Form.Select> */}
                </span>
              </Col>
            </Row>
          ) : null}
          </Col>
      </Row>}
      </>}
    </>
  )
}

export default Discovery ;