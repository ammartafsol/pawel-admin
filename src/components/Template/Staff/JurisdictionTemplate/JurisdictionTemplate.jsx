"use client";
import React, { useState, useMemo, useEffect } from "react";
import classes from "./JurisdictionTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import { userManagementTableHeader } from "@/developementContent/TableHeader/UserManagementTableHeader";
import { userManagementTableBody } from "@/developementContent/TableBody/UserManagementTableBody";
import { FaRegUser } from "react-icons/fa";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import TabsComponent from "@/components/atoms/TabsComponent/TabsComponent";
import Button from "@/components/atoms/Button";
import { IoAddCircle } from "react-icons/io5";
import Link from "next/link";
import AddNewStaffModal from "@/components/organisms/Modals/AddNewStaffModal/AddNewStaffModal";
import { GoLaw } from "react-icons/go";
import CreateJurisdictionModal from "@/components/organisms/Modals/CreateJurisdictionModal/CreateJurisdictionModal";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import CircularLoadingComponent from "@/components/atoms/CircularLoadingComponent/CircularLoadingComponent";
import { jurisdictionTableHeader } from "@/developementContent/TableHeader/juridiction";
import Status from "@/components/atoms/Status/Status";
import useDebounce from "@/resources/hooks/useDebounce";
import { RECORDS_LIMIT } from "@/resources/utils/constant";



const JurisdictionTemplate = () => {
  const [selectedTab, setSelectedTab] = useState("staff");
  const [showAddNewStaffModal, setShowAddNewStaffModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedData,setSelectedData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showAddNewJurisdictionModal, setShowAddNewJurisdictionModal] =
    useState(false);  
  const debouncedSearch = useDebounce(searchValue, 500);
  const [loading, setLoading] = useState("");
  const [data, setData] = useState([]);
  const { Get } = useAxios();

  const handleFilterClick = (e) => {
    // Filter functionality can be implemented here
  };

  const filterOptions = [
    {
      label: "All",
      value: "",
      onClick: () => {
        setStatus("");
        setPage(1);
      },
    },
    {
      label: "Active",
      value: "active",
      onClick: () => {
        setStatus("active");
        setPage(1);
      },
    },
   
    {
      label: "Inactive",
      value: "inactive",
      onClick: () => {
        setStatus("inactive");
        setPage(1);
      },
    },
   
  ];

  // const tableHeaders = useMemo(() => {
  //   const headers = [...jurisdictionTableHeader];


  //   // Update the View Details link to include role query parameter
  //   const viewDetailsIndex = headers.findIndex((h) => h.key === "viewDetails");
  //   if (viewDetailsIndex !== -1) {
  //     headers[viewDetailsIndex] = {
  //       ...headers[viewDetailsIndex],
  //       renderItem: ({ data }) => {
  //         return (
  //           <div
  //             className={classes.viewDetailsLink}
  //             onClick={(e) => {setShowAddNewJurisdictionModal(true);}}
  //           >
  //             Edit Details
  //           </div>
  //         );
  //       },
  //     };
  //   }

    
  //   return headers;
  // }, [selectedTab]);

  const getJurisdictionData = async ({_status}) => {
    setLoading("loading");
    const query = {
      search: debouncedSearch,
      page: page || 1,
      limit: RECORDS_LIMIT,
      status: _status || "",
    }
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({ route: `admin/jurisdiction/all?${queryString}` });
    if (response) {
      setTotalRecords(response?.totalRecords);
      setData(response?.data);
    }
    setLoading("");
  };


  const jurisdictionTableHeader = [
    {
      title: "Name",
      key: "name",
      style: { width: "20%" },
    },
    {
      title: "Description",
      key: "description",
      style: { width: "20%" },
    },
    {
      title: "Status",
      key: "status",
      renderItem: ({ item, data }) => {
        return <Status label={item} variant={data.statusVariant} />;
      },
      style: { width: "20%" },
    },
    {
      title: "Actions",
      key: "viewDetails",
      style: { width: "15%" },
      renderItem: ({ data }) => {
        return (
          <div className={classes.viewDetailsLink} onClick={() => {setSelectedData(data);setShowAddNewJurisdictionModal(true);}}>
            Edit Details
          </div>
        );
      },
    }
  ];



  useEffect(()=>{
    getJurisdictionData({_status: status});
  },[debouncedSearch, status, page]);



  return (
    <div className="p24">
      <Wrapper
        headerComponent={
          <TableHeader
            title="Jurisdiction Management"
            titleIcon={<GoLaw color="#D9D9D9" size={28} />}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search..."
            onFilterClick={handleFilterClick}
            filterOptions={filterOptions}
            viewButtonText="Add New Jurisdiction"
            onClickViewAll={() => {
              setShowAddNewJurisdictionModal(true);
            }}
          />
        }
        contentClassName={classes.contentClassName}
      >
        <ResponsiveTable
          tableHeader={jurisdictionTableHeader}
          data={data}
        />
      </Wrapper>
      <AddNewStaffModal
        show={showAddNewStaffModal}
        setShow={setShowAddNewStaffModal}
      />
      <CreateJurisdictionModal
        show={showAddNewJurisdictionModal}
        setShow={setShowAddNewJurisdictionModal}
        selectedData={selectedData}
        getJurisdictionData={getJurisdictionData}
      />
      {
        loading === 'loading' && <CircularLoadingComponent />
      }
    </div>
  );
};
export default JurisdictionTemplate;
