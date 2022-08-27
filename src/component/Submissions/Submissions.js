// import lib
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Card, Button, Modal } from "react-bootstrap";
import 'babel-polyfill'
import DatePicker from "react-datepicker";
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import moment from "moment";
import axios from "axios";
import ReactQuill from 'react-quill';
import Highcharts from "highcharts";
// import misc
import Loader from "../../commonComponents/Loader/Loader";
import CommonError from "../../commonComponents/CommonError/CommonError";
import { axiosFileMatricsTemplateInstance, axiosCookieStoreTemplateInstance, axiosFileMatricsInstance, axiosCookieStoreInstance,axiosAllTemplatesInstance} from "../../config/appConfig/axiosInstance";
import { getFileMatricsTemplate, getSearchResult, getSearchResultWithoutTerm, submitMatrics,getAllTemplates, getHtml, saveGraphOptions, submitGraph, getTable } from "../../store/actions"
import { useCancelRequests } from "../../customHooks";
import {getAddress} from "../../utils/getServerAddress";
import Chart from "../../commonComponents/Chart/Chart";
import {removeUnderScoreAndCapitalize} from "../../utils/removeUnderScoreAndCapitalize";
import SubmitCard  from "../../commonComponents/SubmitCard/SubmitCard"
// import svg
import { ReactComponent as CalendarSvg } from "../../assets/images/icon_svg/calendar.svg";
import { ReactComponent as EditSvg } from "../../assets/images/icon_svg/edit.svg";
import { ReactComponent as DeleteSvg } from "../../assets/images/icon_svg/delete.svg";
// import css
import "react-datepicker/dist/react-datepicker.css";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-quill/dist/quill.snow.css';
import './submissions.scss'


let modules = {
    toolbar: [
    [{ 'header': [1, 2, false, 4, 5, 6]}],
    [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote',],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
let formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]
let options = {};

let final;
const Submissions = () => {
    useCancelRequests(axiosFileMatricsTemplateInstance, axiosCookieStoreTemplateInstance,axiosFileMatricsInstance, axiosCookieStoreInstance);
    const dispatch = useDispatch();
    const [modal, setTableModal] = useState({
        show: false,
        tableObject: {},
        itemObject: []
    })
    const [form, setForm] = useState({})
    const [selected, setSelected] = useState({});
    const [matricTemplate, allTemplates, graphOptions, tableData] = useSelector(({ submissionsReducer }) => [submissionsReducer.template, submissionsReducer.allTemplates, submissionsReducer.graphOption, submissionsReducer.tableData]);
    useEffect(() => {
        dispatch(getAllTemplates(axiosAllTemplatesInstance))
    }, [])

    const [data, setData] = useState({
        loading: false,
        isError: false,
        errorMessage: "",
        btnFlag: false,
        template: "Associate Weekly Metrics",
        templateUrl: "https://orion-portal-backend-staging/api/v1/file-metrics/template",
        searchQuery: "",
        selectedUrl: "",
        isCompanyEdit : false,
        uniqueId : "",
        openModal: false,
        isSuccess: null,
        message: "",
        hasDispalySection: false
    });

    const [dateFields, setDateFields] = useState({
        from: new Date(),
        to: new Date()
    });

    useEffect(() => {
        let finalArr = {};
        let dropdownState = {};
        if (matricTemplate) {
            matricTemplate?.request_schema?.sections?.map((cards) => {
                if (cards?.occurrence === "multiple") {
                    finalArr[cards.name] = []
                }
                cards?.data_model?.attributes?.map((item) => {
                    let opt = cards.name?.split("_")?.shift()
                    if(data?.template === "Associate Weekly Metrics Graph" && item?.data_type === "datetime") {
                        finalArr[`${opt}_${item?.name}`] = item?.name === "start_time" ? new Date(moment(new Date(new Date().setHours(0, 0, 0, 0))).subtract(30, 'days')) : item?.name === "end_time" ? new Date(new Date().setHours(23, 59, 59, 0)) : "";
                    }
                    if(data?.template === "Associate Weekly Metrics Graph" && item?.data_type === "graph") {
                         getGraphOption(item, opt).then(res=>{
                           dispatch(saveGraphOptions(res))
                         })
                    }
                    if(item?.data_type === "list") {
                        finalArr[`${item?.name}_list`] = []
                    }
                    finalArr[item?.name] = item?.data_type === "dropdown" ? [] : "";
                    if (item?.data_type === "dropdown" ) {
                        finalArr[`selected_${item?.name}`] = []
                    }
                    if (item?.data_type === "dropdown" && item?.describe?.hasOwnProperty("values") && item?.describe?.typeahead === "false") {
                        dropdownState[`staticOption_${item?.name}`] = item?.describe?.values?.map(String)
                        setSelected({
                            ...selected,
                            ...dropdownState
                        })
                    }else if (item?.data_type === "dropdown" && item?.describe?.hasOwnProperty("values_endpoint") && item?.describe?.typeahead === "false") {
                        getOptions(item?.describe?.values_endpoint, item?.name)
                    }
                })
            })
            finalArr[`errors`] = {};
            setForm(finalArr)
        }
    }, [matricTemplate])

    useEffect(()=>{
        if(data?.hasDispalySection) {
            let param = {}, url;
            matricTemplate?.display?.sections?.map((cards) => {
                cards?.data_model?.attributes?.map((item) => {
                    if(item?.data_type === "dropdown") {
                        param[item.name] = typeof form[`selected_${item.name}`]?.[0] === "object" ? form[`selected_${item.name}`]?.[0]?.domain : typeof form[`selected_${item.name}`]?.[0] === "string" ? form[`selected_${item.name}`]?.[0] : "" 
                    } else if(item?.hasOwnProperty("describe")) {
                        let urlArr = item?.describe?.values_endpoint?.split("v1")
                        let newArr = urlArr[1]?.split("?")
                        url = getAddress() + newArr[0]
                    }
                })
            })
            dispatch(getTable(url, param))
        }
    },[data?.hasDispalySection, form])

    const getGraphOption = async (currItem, name) => {
        let urlArr = currItem?.describe?.values_endpoint?.split("v1")
        let url = getAddress() + urlArr[1]
        let param = {
            scoper_email: currItem?.describe?.input_parameters?.scoper_email?.value,
            start_time: moment(new Date(moment(new Date(new Date().setHours(0, 0, 0, 0))).subtract(30, 'days'))).format(),
            end_time: moment(new Date(new Date().setHours(23, 59, 59, 0))).format()
        }
        let resp = await axios.get(`${url}`, {
            params: {...param},
            headers: {
                "Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
            },
        })
        
        let groups = {}, newDate = "", output = [];
        if(!groups[name]) {
            groups[name] = {
                xAxis: {
                    categories: []
                },
                series: [],
            }
        }
        if(groups[name]) {
            resp?.data?.results?.forEach((item) => {
                newDate = `${moment(item?.from_date).format("L")}-${moment(item?.to_date).format("L")}`;
                groups[name][`xAxis`][`categories`].push(newDate)
                for (let itemKeys in item) {
                    let keyName = removeUnderScoreAndCapitalize(itemKeys)
                    let unique = output?.find(o => o.name === keyName);
                    if(!unique && keyName !== "Scoper" && keyName !== "From Date" && keyName !== "To Date" && keyName !== "Uuid") {
                        let newO = {
                            name : keyName,
                            data : [item[itemKeys || null]]
                        }
                        output.push(newO)
                    }else if(unique && Object.keys(unique).length){
                        var existingIndex = output.findIndex(i => i.name === keyName);
                        output[existingIndex]?.data?.push(item[itemKeys])
                    }
                  }
            })
            groups[name][`series`]= output
        }
        return groups
    }
    useEffect(() => {
        getTemplate()
    }, [data?.template])

    const getTemplate = () => {
        setData({
            ...data,
            loading: true,
        })
        let urlEndpoints = data?.templateUrl?.split("v1")
        const axiosInstance = axios.create({
            baseURL: getAddress() + urlEndpoints[1]
          });
        dispatch(getFileMatricsTemplate(axiosInstance)).then((res) => {
            if (res.status === "success") {
                setData({
                    ...data,
                    isError: false,
                    errorMessage: "",
                    loading: false,
                })
            } else {
                setData({
                    ...data,
                    isError: true,
                    errorMessage: "Something went wrong!",
                    loading: false,
                })
            }
        })
    }

    const handleTemplateChange = (e) => {
        let val = JSON.parse(e.target.value)
        setData({
            ...data,
            template: val?.name,
            templateUrl: val?.url,
            hasDispalySection: false
        })
    }
    const handleDate = (date, name) => {
        setDateFields({
            ...dateFields,
            [name]: date,
        })
    }

    const handleInputChange = (e, title) => {
        const { name, value } = e.target
        onChangeValidate(name, value, title)
    }
    const handleDateInputChange = (value, name, title) => {
        onChangeValidate(name, value, title)
    }
    const handleGraphDateInputChange=(dates, name, title, cardName) => {
        const [start, end] = dates;
        setForm({
            ...form,
            [`${cardName}_start_time`]: start,
            [`${cardName}_end_time`]: end,
        })
        if(end) {
            let submissionBody = []
            matricTemplate?.request_schema?.sections?.forEach((cards, idx) => {
                let cardTitle = cards?.name?.split("_").shift();
                cards?.data_model?.attributes?.forEach((cardItem) => {
                    if (cardItem?.data_type === "graph" && cardTitle === cardName) {
                        let urlArr = cardItem?.describe?.values_endpoint?.split("v1")
                        let url = urlArr ? getAddress() + urlArr[1] : null
                        let payload = {
                            scoper_email: cardItem?.describe?.input_parameters?.scoper_email?.value,
                            start_time: moment(start).format(),
                            end_time: moment(end).format()
                        }
                        let finalObj = {
                            url: url,
                            payload: { ...payload }
                        }
                        submissionBody.push(finalObj)
                    }
                })
            })
          
            dispatch(submitGraph(submissionBody, cardName)).then(res=>{
                setData({
                    ...data,
                    // loading: false,
                })
            })
        }
    }

    const handleSearch= (q, item) => {
        let urlArr = item?.describe?.values_endpoint?.split("v1")
        let url = getAddress() + urlArr[1]
        dispatch(getSearchResult(q, url)).then((resp) => {
            if(resp.status === "success") {
                setForm({
                    ...form,
                    [item?.name]: resp?.data?.results?.map((item)=> {
                        if(item.hasOwnProperty("display_name")){
                            return {
                                ...item
                            }
                        } else {
                            return {
                                ...item,
                                date_acquired: item?.date_acquired ? String(item?.date_acquired) : "",
                                display_name: item?.name ? item?.name : "",
                                server_value: item?.domain ? item?.domain : ""
                            }
                        }
                        
                    }) || [],
                })
            }
          });
    }
    const getOptions = (endpoint, name) =>{
        let urlArr = endpoint?.split("v1")
        let url = getAddress() + urlArr[1]
        dispatch(getSearchResultWithoutTerm(url)).then((resp) => {
            if(resp.status === "success") {
                setSelected({
                    ...selected,
                    [`staticOption_${name}`]: resp?.data?.results || resp?.data?.data?.map((item)=> {
                        if(item.hasOwnProperty("display_name")){
                            return {
                                ...item
                            }
                        } else {
                            return {
                                ...item,
                                display_name: item?.name ? item?.name : "",
                                server_value: item?.id ? item?.id : ""
                            }
                        }
                        
                    }) || []
                })
            }
          });
    }
    const handleDropdownChange = (value, name, title) => {
        let isError = { ...form[`errors`] };
        isError[name] = !value.length ? `Please enter ${title?.toLowerCase()}` : ""
        let selectedOptKey = `selected_${name}`
        setForm({
            ...form,
            [selectedOptKey]:  value,
            [`errors`]: isError
        })
    }
  
    const handleTypeaheadChanges = (value, item) => {
        let isError = { ...form[`errors`] };
        isError[item?.name] = !value.length ? `Please enter ${item?.title?.toLowerCase()}` : ""
        let selectedOptKey = `selected_${item?.name}`
        setForm({
            ...form,
            [selectedOptKey]:  value,
            [`errors`]: isError
        })
        if(value[0]?.server_value?.includes("https://")){
            getHtmlForTemplate(value[0]?.server_value)
        }
    }

    const getHtmlForTemplate = (urlVal) => {
        let urlArr = urlVal?.split("v1")
        let url = getAddress() + urlArr[1]
        dispatch(getHtml(url)).then((resp) => {
            if(resp.status === "success") {
                setForm({
                    ...form,
                    [`html_template`]: resp?.data?.template
                })
            }
          });
    }
    const addList = (e, val, name) => {
        // e.preventDefault();
        if( e.key == "Enter" && val) {
            setForm({
                ...form,
                [`${name}_list`]:  [...form[`${name}_list`], val],
                [name]: "",
            })
        }
    }

    const removeFromList = (name, index) => {
        let newForm = {...form}
        let newlistArr = newForm[`${name}_list`].filter((ele, idx)=> {
            return idx != index
        })
        setForm({
            ...form,
            [`${name}_list`]:  [...newlistArr],
        })
    }

    const addMore = (cardObj) => {
        let errorObj = {...form[`errors`]};
        if(validateMoreCall(cardObj)){
            return
        }
         final = cardObj?.data_model.attributes?.reduce((obj, item) => {
            obj[item.name] = form[item.name]
            return obj
        }, {})
        let hasData = false
        for (var i in final) {
            if (final[i] !== "" ) {
                if(!data?.isCompanyEdit) {
                    final["id"] = Date.now()
                }
                hasData = true;
            }
        }
        if(hasData) {
            if(data?.isCompanyEdit) {
                let finalObj = form[cardObj?.name]?.map((item)=> {
                    if ( item.id === data?.uniqueId) {
                        return cardObj?.data_model.attributes?.reduce((obj, item) => {
                            obj[item.name] = form[item.name]
                            return obj
                        }, {})
                      }
                      return item;
                })
                setForm({
                    ...form,
                    [cardObj?.name]:[...finalObj],
                }) 
                setData({
                    ...data,
                    uniqueId: "",
                    isCompanyEdit: false
                })
            } else {
                errorObj[`company_call_summaries`] = "" ;
                setForm({
                    ...form,
                    [cardObj?.name]:[...form[cardObj?.name],  final],
                    [`errors`]: errorObj
                })
            }
            
            hasData = false
        }
    }
    useEffect(()=>{
        let neWForm = {...form}
        for (var i in final) {
            neWForm[i] = ""
        }
        setForm({
            ...neWForm
        })
    },[final])

    const HandleCardEdit = (id, name) => {
        let finalObj = form[name]?.filter((item)=> {
            return  item.id === id
        })
        let neWForm = {...form}
        for (let key in finalObj[0]) {
            neWForm[key] =  finalObj[0][key]
        }
        setForm({
            ...neWForm
        })
        setData({
            ...data,
            uniqueId: id,
            isCompanyEdit: true
        })
    }
    const HandleCardDelete =(id, name)=>{
        let finalObj = form[name]?.filter((item)=> {
            return  item.id !== id
        })
        setForm({
            ...form,
            [name] : [...finalObj]
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isValidate(data?.template)) {
            return
        }

        let urlArr = matricTemplate?.api ? matricTemplate?.api?.endpoint?.split("v1") : matricTemplate?.request_schema?.api ? matricTemplate?.request_schema?.api?.endpoint?.split("v1") : null
        let url = urlArr ? getAddress() + urlArr[1] : null
        let submissionBody = {};
        if (data?.template === "Associate Weekly Metrics") {
            submissionBody = matricTemplate?.request_schema?.sections?.reduce((obj, cards) => {
                if (cards?.name === "active_market_dives") {
                    obj[cards.name] = form[`selected_markets`]?.map(function (item) {
                        return item['server_value'];
                    })
                } else if (cards?.name === "companies_actively_working") {
                    obj[cards.name] = form[`selected_companies`]?.map(function (item) {
                        return item['server_value'];
                    })
                } else if (cards?.name === "company_call_summaries") {
                    obj[cards?.name] = form[`company_call_summaries`].map(function (item) {
                        delete item.id
                        return item;
                    })

                } else {
                    obj[cards?.name] = cards?.data_model?.attributes?.reduce((itemObj, cardItem) => {
                        itemObj[cardItem.name] = form[cardItem.name]
                        return itemObj
                    }, {})
                }

                return obj
            }, {})
            submissionBody[`from_date`] = moment(dateFields[`from`]).format();
            submissionBody[`to_date`] = moment(dateFields[`to`]).format()
        } else {
            submissionBody = matricTemplate?.request_schema?.sections?.reduce((obj, cards) => {
                let cardObj = cards?.data_model?.attributes?.reduce((itemObj, cardItem) => {
                    if (cardItem?.data_type === "dropdown") {
                        let items = ""
                        form[`selected_${cardItem.name}`]?.forEach(function (item) {
                            if (typeof item == "string") {
                                items = item;
                            } else {
                                if (item['server_value'].includes("https://")) {
                                    items = item['display_name']
                                } else {
                                    items = item['server_value'];
                                }
                            }
                        })
                        itemObj[cardItem.name] = items
                    } else if (cardItem?.data_type === "list") {
                        itemObj[cardItem.name] = form[`${cardItem.name}_list`]
                    } else {
                        itemObj[cardItem.name] = form[cardItem.name]
                    }
                    return itemObj
                }, {})
                return cardObj
            }, {})
        }
        urlArr && setData({
            ...data,
            loading: true,
        })
        urlArr && dispatch(submitMatrics(url, submissionBody)).then(res => {
            if (res.status === "success") {
                setData({
                    ...data,
                    isError: false,
                    errorMessage: "",
                    loading: false,
                    message: "Your data is submitted successfully!",
                    openModal: matricTemplate?.hasOwnProperty("display") ? false : true,
                    isSuccess: true,
                    hasDispalySection: matricTemplate?.hasOwnProperty("display") ? true : false
                })
            } else {
                setData({
                    ...data,
                    isError: false,
                    errorMessage: "",
                    loading: false,
                    message: "Error Saving Data",
                    openModal: true,
                    isSuccess: false
                })
            }
        })

    }
    const validateMoreCall = (cards) => {
        let isError = false, errorObj = {...form[`errors`]};
        cards?.data_model.attributes?.forEach((item) => {
            let fieldName = item.name
            let typeOfObject = typeof form[fieldName]
            let isRequired = true
            if(fieldName === "domain" &&  !(form[fieldName]?.startsWith("https://"))){
                errorObj[fieldName] = `Please enter valid url`
                isError = true
            }
            if(typeOfObject == "string" && !form[fieldName] && isRequired) {
                errorObj[fieldName] = `Please enter ${item.title?.toLowerCase()}`
                isError = true
           } 
           if(typeOfObject == "string" && (item.data_type == "timestamp") &&  !form[fieldName] && isRequired) {
            errorObj[fieldName] = `Please enter date`
            isError = true
            }
        }) 
        setForm({
            ...form,
            [`errors`]: errorObj
        })
        return isError
    }

    const isValidate = (selectedTemplate) => {
        let isError = false, errorObj = {};

        if(selectedTemplate === "Associate Weekly Metrics Graph") {
            return isError
        }
        if(selectedTemplate === "Associate Weekly Metrics") {
            matricTemplate?.request_schema?.sections?.forEach(element => {
                if(element.name !== "company_call_summaries") {
                    element?.data_model?.attributes?.forEach((item)=> {
                        let fieldName = item.name
                        let typeOfObject = typeof form[fieldName]
                        let isRequired = true
                        
                        if(typeOfObject == "string" && !form[fieldName] && isRequired) {
                            errorObj[fieldName] = `Please enter ${item.title?.toLowerCase()}`
                            isError = true
                        } 
                       if(typeOfObject == "object" && form[`selected_${fieldName}`].length === 0 && isRequired ) {
                        errorObj[fieldName] = `Please select ${item.title?.toLowerCase()}`
                        isError = true
                       }
                       if(typeOfObject == "string" && (item.data_type == "timestamp") &&  !form[fieldName] && isRequired) {
                        errorObj[fieldName] = `Please enter date`
                        isError = true
                        } 
                    })
                }
                if(element.occurrence === "multiple" &&  !(form[element.name] && Object.keys(form[element.name]).length > 0)) {
                    errorObj[element.name] = `Please  add ${element.title?.toLowerCase()} and save`
                    isError = true
                }
            });
        } else {
            matricTemplate?.request_schema?.sections?.forEach(element => {
                element?.data_model?.attributes?.forEach((item)=> {
                    let fieldName = item.name
                    let typeOfObject = typeof form[fieldName]
                    let isRequired = item?.required === "false" ? false : true

                    if (data?.template === "Downstream Cookie" && typeOfObject === "string" && isRequired) {
                        if(item?.hasOwnProperty("describe") && form[`selected_${item?.describe?.dependent_on}`][0] === item?.describe?.visible_on_selected_value && !form[fieldName]) {
                            errorObj[fieldName] = `Please enter ${item.title?.toLowerCase()}`
                            isError = true
                        } else if(!item?.hasOwnProperty("describe") && !form[fieldName]) {
                            errorObj[fieldName] = `Please enter ${item.title?.toLowerCase()}`
                            isError = true
                        }
                    } else if (data?.template !== "Downstream Cookie" && typeOfObject === "string" && !form[fieldName] && isRequired) {
                        errorObj[fieldName] = `Please enter ${item.title?.toLowerCase()}`
                        isError = true
                    }
                   if(typeOfObject === "object" && (item.data_type == "list")  && form[`list_${fieldName}`].length === 0 && isRequired ) {
                    errorObj[fieldName] = `Please select ${item.title?.toLowerCase()}`
                    isError = true
                   } else if(typeOfObject === "object" && form[`selected_${fieldName}`].length === 0 && isRequired ) {
                    errorObj[fieldName] = `Please select ${item.title?.toLowerCase()}`
                    isError = true
                   }
                })
            })
        }
        
        setForm({
            ...form,
            [`errors`]: errorObj
        })
        return isError
    }

    const handleEditor = (val, name, title) => {
        let isError = { ...form[`errors`] };
        isError[name] = !val ? `Please enter ${title?.toLowerCase()}` : ""
        setForm({
            ...form,
            [name]: val,
            [`errors`]: isError
        })
    }
    const onChangeValidate = (name, value, title) => {

        let isError = { ...form[`errors`] };
        isError[name] = !value ? `Please enter ${title?.toLowerCase()}` : ""
        if((name === "company_name" && value) || (name === "domain" && value) ||  (name === "product" && value) || (name === "why_now" && value)) {
            isError[`company_call_summaries`] = "" 
        }
        setForm({
            ...form,
            [name]: value,
            [`errors`]: isError
        })
    }
    const renderCard = (schema) => {
        return schema?.sections?.map((cards, idx) => {
            return (
                <Row className="m-0" key={`cards-${idx}`}>
                    <Col md={12} lg={8} className="m-b-40" keys={`cards-${idx}`}>
                        {cards?.occurrence === "multiple" ? <div className="d-flex justify-content-between align-items-center">
                            <span className="main-title m-b-10">Customer / Network details</span>
                            <Button variant="primary" onClick={() => addMore(cards)}>{data?.isCompanyEdit ? "Save" : "Add/Save Call"}</Button> 
                        </div> : <div className="main-title m-b-10">{cards?.title}</div>}
                        <Card>
                            <Card.Body className="p-10" style={{paddingBottom:"10px"}}>
                                <Row className="m-0" >
                                    {cards?.data_model?.attributes && renderCardItem(cards?.data_model?.attributes, cards?.name)}
                                </Row>
                                {cards?.occurrence === "multiple" && form[`errors`]?.[cards.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[cards.name] }</span>}
                            </Card.Body>
                        </Card>
                    </Col>
                    {cards?.occurrence === "multiple" && form[cards.name]?.length > 0  ? renderMoreCard(cards.name) : null}
                </Row>
            )
        })
    }

    const renderMoreCard = (name) => {
        return (
            <Col md={12} lg={4} className="m-t-40"  style={{marginTop: "46px"}}>
                <Card style={{ maxHeight: "436px", overflowY: "scroll"}}>
                    <Card.Body className="p-10">
                        {form[name]?.length > 0 ? 
                        form[name]?.map((cardItems, id) =>{
                            return (
                                <Row className="m-0" key={`cardItems-${id}`}>
                                    <Col xs={12}>
                                        <div className="d-flex justify-content-between ">
                                            <span className="main-title lightGrey">{cardItems?.company_name}</span>
                                            <span className="d-flex">
                                                <span className="mr-1 cursor-pointer iconbox" style={{marginRight: "4px"}} onClick={()=>HandleCardEdit(cardItems.id, name)}><EditSvg/></span>
                                                <span className="ml-1 cursor-pointer iconbox" style={{marginLeft: "4px"}} onClick={()=>HandleCardDelete(cardItems.id, name)}><DeleteSvg /></span>
                                            </span>
                                        </div>
                                        <div className="divider mt-2 mb-1" style={{backgroundColor: "ccc"}}></div>
                                    </Col>
                                    <a className="primaryGrey mb-2" href={cardItems?.domain} target="_blank" >{cardItems?.domain}</a>
                                    <div className="primaryGrey mb-2">Product :</div>
                                    <div className="lightGrey mb-2">{cardItems?.product ? cardItems?.product : "-"}</div>
                                    <div className="primaryGrey mb-2">Why Now :</div>
                                    <div className="lightGrey mb-2">{cardItems?.why_now ? cardItems?.why_now : "-"}</div>
                                    <div className="primaryGrey mb-2">Matrics :</div>
                                    <div className="lightGrey mb-2">{cardItems?.metrics ? cardItems?.metrics : "-"}</div>
                                    <div className="primaryGrey mb-2">Next Steps:</div>
                                    <div className="lightGrey mb-2">{cardItems?.next_steps ? cardItems?.next_steps : "-"}</div>
                                    {cardItems?.call_date && <>
                                        <div className="primaryGrey mb-2">Date:</div>
                                    <div className="lightGrey mb-2">{moment(cardItems?.call_date).format("MMM DD YYYY")? moment(cardItems?.call_date).format("MMM DD YYYY") : "-"}</div>
                                    </>}
                                    <br/>
                                    <hr/>
                                    <div className="mb-4"></div>
                                </Row>
                            )
                        }): null}
                        
                    </Card.Body>
                </Card>
            </Col>
        )
    }
    const renderCardItem = (arr, name) => {
        return arr?.map((item, indx) => {
            let isEven = indx % 2 == 0
            switch (item.data_type) {
                case "int":
                    return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`int-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>{item?.title}</Form.Label>
                            <Form.Control name={item?.name} type="number" placeholder={`Enter ${item?.title?.toLowerCase()}`} value={form[item?.name]} onChange={(e)=>handleInputChange(e, item?.title)} min={0}/>
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    break;
                case "string":
                    if (data?.template === "Downstream Cookie") {
                        if (item?.hasOwnProperty("describe") && form[`selected_${item?.describe?.dependent_on}`][0] === item?.describe?.visible_on_selected_value) {
                            return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`string-${indx}`}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>{item?.title}</Form.Label>
                                    <Form.Control name={item?.name} type="text" placeholder={`Enter ${item?.title?.toLowerCase()}`} value={form[item?.name]} onChange={(e) => handleInputChange(e, item?.title)} />
                                    {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name]}</span>}
                                </Form.Group>
                            </Col>
                            break;
                        } else if (!item?.hasOwnProperty("describe")) {
                            return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`string-${indx}`}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>{item?.title}</Form.Label>
                                    <Form.Control name={item?.name} type="text" placeholder={`Enter ${item?.title?.toLowerCase()}`} value={form[item?.name]} onChange={(e) => handleInputChange(e, item?.title)} />
                                    {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name]}</span>}
                                </Form.Group>
                            </Col>
                            break;
                        } else {
                            return null
                            break;
                        }
                    } else if (data?.template !== "Downstream Cookie") {
                        return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`string-${indx}`}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>{item?.title}</Form.Label>
                                <Form.Control name={item?.name} type="text" placeholder={`Enter ${item?.title?.toLowerCase()}`} value={form[item?.name]} onChange={(e) => handleInputChange(e, item?.title)} />
                                {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name]}</span>}
                            </Form.Group>
                        </Col>
                        break;
                    } 
                case "dropdown":
                    if(item?.describe?.typeahead === "true") {
                        return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`dropdown-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>{item?.title}</Form.Label>
                            <AsyncTypeahead
                                bodyContainer={"#root"}
                                id="dropdown"
                                isLoading={false}
                                labelKey={"display_name"}
                                minLength={3}
                                onChange={(val) => handleTypeaheadChanges(val, item)}
                                onSearch={(q) => {
                                       handleSearch(q, item)
                                    }
                                }
                                options={form[item?.name]}
                                placeholder={`Search ${item?.title?.toLowerCase()}`}
                                selected={form[`selected_${item?.name}`]}
                                renderMenuItemChildren={(option) => {
                                   return <div>
                                        <span>{option.display_name}</span>
                                    </div>
                                }}
                                useCache={false}
                                multiple={item?.describe?.choose_one === "false"}
                            />
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    } else {
                        return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`dropdown-${indx}`}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>{item?.title}</Form.Label>
                                <Typeahead
                                    labelKey="display_name"
                                    id="dropdown"
                                    name={item?.name}
                                    onChange={(val)=> handleDropdownChange(val, item?.name, item?.title)}
                                    options={selected[`staticOption_${item?.name}`] || []}
                                    placeholder={`Select ${item?.title?.toLowerCase()}`}
                                    selected={form[`selected_${item?.name}`]}
                                    useCache={false}
                                    multiple={item?.describe?.choose_one === "false"}
                                />
                                {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                            </Form.Group>
                    </Col>
                    }
                    break;    
                case "timestamp":
                    return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`timestamp-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ position: "relative" }}>
                            <Form.Label>{item?.title}</Form.Label>
                            <DatePicker name={item?.name} className="w-100" dateFormat="MMM dd yyyy" placeholderText={'MMM DD YYYY'} selected={form[item?.name]} onChange={date => handleDateInputChange(date, item?.name, item?.title )} maxDate={new Date()}/>&nbsp;<CalendarSvg className="iconClass" />
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    break;
                case "editor":
                    return <Col xs={12} md={12} key={`editor-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ position: "relative" }}>
                            <Form.Label>{item?.title}</Form.Label>
                            <ReactQuill theme="snow" value={form[item?.name]} onChange={(val)=>handleEditor(val, item?.name, item?.title)} modules={modules}
                            formats={formats}
                            placeholder={`Add your content ...`}
                            />
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    break;
                case "url":
                    return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`url-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>{item?.title}</Form.Label>
                            <Form.Control name={item?.name} type="url" placeholder={`Enter ${item?.title?.toLowerCase()}`} value={form[item?.name]} onChange={(e)=>handleInputChange(e, item?.title)} />
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    break;
                case "email":
                    return <Col xs={12} md={isEven ? 5 : { span: 5, offset: 1 }} key={`email-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>{item?.title}</Form.Label>
                            <Form.Control name={item?.name} type="email" placeholder={`Enter ${item?.title?.toLowerCase()}`} value={form[item?.name]} onChange={(e)=>handleInputChange(e, item?.title)} />
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    break;
                case "datetime" :
                    let title = name?.split("_").shift() +"_"+item?.name;
                    let cardName = name?.split("_").shift();
                    if(item?.name == "end_time") {
                        return <Col xs={12} md={6} key={`datetime-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ position: "relative" }}>
                            <Form.Label>Select Period</Form.Label>
                            <DatePicker name={title} className="w-100" dateFormat="MMM dd yyyy" placeholderText={"Select date-range"} selectsRange startDate={form[`${cardName}_start_time`]} endDate={form[`${cardName}_end_time`]} onChange={(updates) => handleGraphDateInputChange(updates, title, item?.title, cardName )} maxDate={new Date()}/>&nbsp;<CalendarSvg className="iconClass" />
                            {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>}
                        </Form.Group>
                    </Col>
                    break;
                    } else {
                        return null;
                        break;
                    }
                case "graph" :
                    return <Col xs={12} md={12} key={`graph-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ position: "relative" }}>
                            <Form.Label>{item?.title}</Form.Label>
                            {renderGraph(name)}
                        </Form.Group>
                    </Col>
                    break;
                case "list" :
                    return <>
                        <Col xs={10} md={isEven ? 5 : { span: 5, offset: 1 }} key={`list-${item?.name}-${indx}`}>
                            <Form.Group className="mb-2" controlId="formBasicEmail" style={{ position: "relative" }}>
                                <Form.Label>{item?.title}</Form.Label>
                                <ul className="tag-box d-flex">
                                    <Form.Control name={item?.name} type="text" placeholder={!form[`${item?.name}_list`]?.length ? `Add ${item?.title?.toLowerCase()}` : ""} value={form[item?.name]} onChange={(e) => handleInputChange(e, item?.title)} onKeyPress={(e) => addList(e, form[item?.name], item?.name)} />
                                    {form[`${item?.name}_list`]?.length ? form[`${item?.name}_list`]?.map((listItem, indx) => {
                                        return (
                                            <li className="tags" key={`listitem-${indx}`}>{listItem}<span className="removeTag" onClick={() => removeFromList(item?.name, indx)}>x</span></li>
                                        )
                                    }) : null}
                                </ul>
                                {/* {form[`errors`]?.[item?.name] && <span className="warningText card-body-paragraph">{form[`errors`]?.[item?.name] }</span>} */}
                            </Form.Group>
                        </Col>
                    </>
                    break;
                case "table" :
                    return <Col xs={12} md={12} key={`graph-${indx}`}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ position: "relative" }}>
                            <Form.Label>{item?.title}</Form.Label>
                            {renderTable(item)}
                        </Form.Group>
                    </Col>
                    break;
            }
        })
    }
    
    const renderGraph = (name) => {
        let optionName = name?.split("_")?.shift()
        return(
            <Chart options={graphOptions[optionName] || {}} highcharts={Highcharts} />
        )
    } 

    const renderTable = (item) => {
        return(
            <div className="custom-table-firm">
            <ul className="table-header">
              {renderHeader(item?.fields)}
            </ul>
            <ul className="table-body">
                {renderBody(item?.fields,)}
            </ul>
          </div>
        )
    }
    const renderHeader = (item) => {
        return item?.map(headerItem => {
            return (
                <li className="text-center text-capitalize">{headerItem?.title}</li>
            )
        })
    }
    const renderBody = (item) => {
        return <> {tableData?.length ? tableData?.map(tableItem => {
            return (
                <li onClick={()=>handleListModal(tableItem, item)} style={{cursor:"pointer"}}>
                    {Object.keys(tableItem).map((key, indx) => {
                        let val = item[indx]?.column_name && item[indx]?.column_name === "created_at" ? moment(
                            tableItem[`${item[indx]?.column_name}`]
                          ).format("MMM DD YYYY"):item[indx]?.column_name && item[indx]?.column_name !== "created_at" ? tableItem[`${item[indx]?.column_name}`] : ""
                          val =  String(val)
                        return (<>
                            {val ? <div className="text-center text-capitalize singleLineTxt">{val}</div> : null}
                            </>
                        )
                    })}
                </li>
            )
        }) : <div>No data available</div> } </>
    }
    const handleListModal = (tableItem, item) => {
        setTableModal({
            ...modal,
            show: true,
            tableObject: tableItem,
            itemObject: item
        })
    }

    const renderModal = () => {
        return (
            <Modal
                show={modal?.show}
                onHide={()=>setTableModal({...modal, show: false})}
                dialogClassName="custom-modal"
                aria-labelledby=""
                size="lg"
            >
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="main-title">
                        Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                {Object.keys(modal?.tableObject).map((key, indx) => {
                        let val = key  && key === "created_at" ? moment(
                            modal?.tableObject[`${key}`]
                          ).format("MMM DD YYYY"): key  && key !== "created_at" ? modal?.tableObject[`${key}`] : ""
                          val =  String(val)
                        return (<>
                            {val ? <div className="text-capitalize">
                                <div className="primaryGrey mb-2">{removeUnderScoreAndCapitalize(key)}</div>
                                {val && val?.includes("<p>") ? <div className="lightGrey mb-2"><span dangerouslySetInnerHTML={{__html:val}}></span></div>: <div className="lightGrey mb-2">{val}</div>}
                            </div> : null}
                            </>
                        )
                    })}
                </Modal.Body>
            </Modal>
        )
    }

    const handleContinue = () => {
        if(data.isSuccess) {
           resetData()
        } 
        setData({...data, openModal: false, isSuccess: null, message: ""})
    }
    const resetData = () => {
        let newArr = {...form}
        for (let key in form){
            newArr[key] =  Array.isArray(form[key]) ? [] : ""
        }
        setForm(newArr)
        setSelected({
            ...selected,
            [`selectedOption`]: []
        })
        setDateFields({
            from: new Date(),
            to: new Date()
        })
    }

    return (
        <>
        {modal?.show && renderModal()}
            {data?.openModal && <SubmitCard showToast={data?.openModal} onHide={()=>handleContinue()} isSuccess={data?.isSuccess} message={data?.message}/>}
            <Row className="m-b-30">
                <Col xs={12} className="m-b-40">
                    <Row className="m-0" key={`date-`}>
                        <Col xs={12} className="">
                            <div className="top-header-box d-flex align-items-center m-t-30">
                                <span className="m-r-10">Choose a Template</span>
                                <Form.Select aria-label="Default select example" className="w-50" onChange={(e) => handleTemplateChange(e)}>
                                    {allTemplates?.map((item, idx) => {
                                        return (
                                            <option value={JSON.stringify(item)} className="text-capitalize" key={`options-${idx}`}>{item?.name}</option>
                                        )
                                    })}
                                </Form.Select>
                            </div>
                        </Col>
                    </Row>
                </Col>
                {data.loading ? <Col xs={12}> <Loader scale={30} message={"Loading ..."} customStyle={"child"} /></Col> : data?.isError ? <CommonError errorMessage={data?.errorMessage} isBlurredRequired={true} /> :
                    <Form  autoComplete="off">
                        {matricTemplate?.request_schema?.hasOwnProperty('from') && matricTemplate?.request_schema?.hasOwnProperty('to') &&
                            <Row className="m-0" key={`date-`}>
                                <Col md={12} lg={8} className="m-b-40">
                                    <Card>
                                        <Card.Body className="p-10" style={{paddingBottom:"0px"}}>
                                            <Row className="m-0">
                                                <Col xs={12} md={5} >
                                                    <Form.Group className="mb-3 m-r-10 w-100 position-relative" controlId="formBasicEmail">
                                                        <Form.Label>From:</Form.Label>
                                                        <DatePicker name="from" selected={dateFields?.from} onChange={date => handleDate(date, "from")} className="w-100" dateFormat="MMM dd yyyy" placeholderText={'MMM DD YYYY'} />&nbsp;<CalendarSvg className="iconClass" />
                                                        {/* {form?.errors && form?.errors["startDate"] && <span className="warningText card-body-paragraph">{form.errors["startDate"]}</span>} */}
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={{ span: 5, offset: 1 }}>
                                                    <Form.Group className="mb-3 m-r-10 w-100 position-relative" controlId="formBasicEmail">
                                                        <Form.Label>To:</Form.Label>
                                                        <DatePicker name="to" selected={dateFields?.to} onChange={date => handleDate(date, "to")} className="w-100" dateFormat="MMM dd yyyy" placeholderText={'MMM DD YYYY'} />&nbsp;<CalendarSvg className="iconClass" />
                                                        {/* {form?.errors && form?.errors["endDate"] && <span className="warningText card-body-paragraph">{form.errors["endDate"]}</span>} */}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        }
                        {data?.hasDispalySection ? renderCard(matricTemplate?.display) : renderCard(matricTemplate?.request_schema)}
                        {}
                        <Col xs={12} md={12} lg={8} className="d-flex justify-content-center mt-2">
                           {data?.template !== "Associate Weekly Metrics Graph" && !data?.hasDispalySection && <Button variant="primary" onClick={(e)=>handleSubmit(e)} >Submit</Button>} 
                        </Col>
                    </Form>
                }
            </Row>
        </>
    );
};

export default Submissions;


    

