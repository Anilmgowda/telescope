import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router"
import { useDispatch } from "react-redux";
import { Nav, Form, Navbar} from "react-bootstrap";
import { AsyncTypeahead, Menu, MenuItem } from "react-bootstrap-typeahead";


import logoImg from "../../assets/images/logo.png";
import { ReactComponent as NotificationSvg } from "../../assets/images/icon_svg/notification.svg";
import { getCompanySearchResult, initializeLogout } from "../../store/actions";

import {
  axiosCompanySearchInstance
} from "../../config/appConfig/axiosInstance";

import './navbar.scss'

// import { history } from "../../config";

const navItems = [
  { name: "Investor Feed", path: "dashboard" },
  { name: "Discovery", path: "discovery" },
  { name: "Conversations", path: "conversations" },
  { name: "Firm Management", path: "submissions" },
];

const Navigationbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [activeFilter, setActiveFilter] = useState({
    active : "all",
  });
  const [data, setData] = useState({
    searchTerm: "",
    searchData: [],
    selectedData: [],
    filteredData:[],
  });

  const [extended, setExtended] = useState(false);

  const handleRoute = (item) => {
    navigate(`/${item?.path}`);
    setActiveTab(`/${item?.path}`);
    setExtended(false);
  };

  useEffect(() => {
    if (localStorage.getItem("externalRoutes")) {
      setActiveTab(`${localStorage.getItem("externalRoutes")}`);
      navigate(`${localStorage.getItem("externalRoutes")}`);
      localStorage.removeItem("externalRoutes")
      return
    }
    if (location.pathname == "/conversations") {
      setActiveTab(`/conversations`);
    } else if (location.pathname == "/dashboard") {
      setActiveTab(`/dashboard`);
    } else if (location.pathname == "/discovery") {
      setActiveTab(`/discovery`);
    } else if (location.pathname == "/submissions") {
      setActiveTab(`/submissions`);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    navigate("/dashboard", { replace: true });
    dispatch(initializeLogout())
  }
  const handleSearch = (q, item) => {
    let params = {
      search_term : q
    }
    dispatch(getCompanySearchResult(axiosCompanySearchInstance,params)).then((resp) => {
      if (resp.status === "success") {
        let filter = activeFilter?.active
        let filterD = []
        if(filter === "all") {
          filterD = resp?.data?.results
        } else {
          filterD = data.searchData?.filter(item => {
            let searchItem = item[`${filter}`]?.toLowerCase()
            return searchItem?.includes(`${data?.searchTerm?.toLowerCase()}`)
          })
        }
        setData({
          ...data,
          searchTerm: q,
          searchData: resp?.data?.results || [],
          filteredData: filterD
        })
      }
    });
  }
  useEffect(()=> {
    if(data?.selectedData?.length) {
      navigate({
        pathname: "/companyProfile",
        search: new URLSearchParams({
          affinity_company_id: data?.selectedData[0]?.affinity_id,
          company_domain: data?.selectedData[0]?.domain,
        }).toString(),
      });
    }
  },[data.selectedData])

  const handleCompanyChange = (val) => {
    setData({
      ...data,
      selectedData: val
    })
  } 
  const handleFilter = (filter) => {
    let filterD = []
    if(filter === "all") {
      filterD = data.searchData
    } else {
      filterD = data.searchData?.filter(item => {
        let searchItem = item[`${filter}`]?.toLowerCase()
        return searchItem?.includes(`${data?.searchTerm?.toLowerCase()}`)
      })
    }
    setData({
      ...data,
      filteredData: filterD
    })
    setActiveFilter({...activeFilter, active :filter})
  }
  return (
    <>
      <Navbar
        expand="lg"
        expanded={extended}
        style={{ background: "#fff" }}
        className={extended ? "extended" : ""}
      >
        <Navbar.Brand
          onClick={() => {
            navigate("/dashboard");
            setActiveTab("/dashboard");
          }}
        >
          <span className="cursor-pointer m-r-20 m-l-20">
            <img src={logoImg} alt="Logo" />
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExtended(!extended)}
          className=""
        />
        <Navbar.Collapse
          id="responsive-navbar-nav "
          className="justify-content-between p-r-26  p-l-26"
        >
          <Nav className="mr-auto" variant="pills">
            {navItems?.map((item, index) => {
              return (
                <Nav.Item key={index} onClick={() => handleRoute(item)}>
                  <Nav.Link
                    className={activeTab == `/${item?.path}` ? "active" : ""}
                  >
                    {item?.name}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <div className="search-box">
            <Form.Group
              controlId="formBasicEmail">
              <AsyncTypeahead
                // filterBy={data.filterByFields}
                className="search-bar"
                bodyContainer={"#root"}
                id="dropdown"
                isLoading={false}
                // ref={searchRef}
                labelKey="name"
                minLength={3}
                onChange={(val) => handleCompanyChange(val)}
                selected={data?.selectedData}
                onSearch={(q) => {
                  handleSearch(q)
                }}
                options={data[`filteredData`]}
                onFocus={(e) => {
                  e.target.placeholder = "Search for People, Companies, Documents etc..."
                }}
                placeholder={'Search for People, Companies, Documents etc...'}
                renderMenu={(results, menuProps, state) => (
                  <Menu {...menuProps}>
                    <div className="d-flex mb-2 filterBox flex-wrap">
                      <span className={activeFilter?.active == `all` ? "filterItem active" : "filterItem"} onClick={()=>handleFilter("all")}>All</span>
                      <span className={activeFilter?.active == `name` ? "filterItem active" : "filterItem"} onClick={()=>handleFilter("name")}>Company Name</span>
                      <span className={activeFilter?.active == `domain` ? "filterItem active" : "filterItem"} onClick={()=>handleFilter("domain")}>Domain</span>
                    </div>
                    {results.map((result, index) => (
                      <MenuItem option={result} position={index}>
                        <div className="main-paragraph">{result.name}</div>
                        <div className="card-body-paragraph lightGrey">{result.domain}</div>
                      </MenuItem>
                    ))}
                  </Menu>
                )}
                useCache={false}
              />
            </Form.Group>
          </div>
          <Nav className="d-flex">
            {!extended ? (
              <NotificationSvg
                width="18"
                height="24"
                className="m-r-20 m-t-5"
              />
            ) : (
              <Nav.Item className="m-r-20 f-12">
                <Nav.Link className="">Notifications</Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item className="m-r-20 f-12">
              <Nav.Link className="">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item className="m-r-20 f-12">
              <Nav.Link
                className=""
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export { Navigationbar };
