"use client";
import React, { useState, useEffect } from "react";
import classes from "./CaseTypeTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { MdOutlineAssignment } from "react-icons/md";
import CreateCaseTypeModal from "@/components/organisms/Modals/CreateCaseTypeModal/CreateCaseTypeModal";
import useAxios from "@/interceptor/axios-functions";
import CircularLoadingComponent from "@/components/atoms/CircularLoadingComponent/CircularLoadingComponent";
import Status from "@/components/atoms/Status/Status";
import useDebounce from "@/resources/hooks/useDebounce";
import { RECORDS_LIMIT } from "@/resources/utils/constant";

const CaseTypeTemplate = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedData, setSelectedData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showAddNewCaseTypeModal, setShowAddNewCaseTypeModal] = useState(false);
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

  const getCaseTypeData = async ({ _status, _page }) => {
    setLoading("loading");
    const query = {
      search: debouncedSearch,
      page: _page || page || 1,
      limit: RECORDS_LIMIT,
      status: _status || "",
    };
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({ route: `admin/case-type/all?${queryString}` });
    if (response) {
      setTotalRecords(response?.totalRecords);
      setData(response?.data || []);
    }
    setLoading("");
  };

  const caseTypeTableHeader = [
    {
      title: "Name",
      key: "name",
      style: { width: "25%" },
    },
    {
      title: "Jurisdiction",
      key: "jurisdiction",
      style: { width: "20%" },
      renderItem: ({ data }) => {
        return <span>{data?.jurisdiction?.name || "N/A"}</span>;
      },
    },
    {
      title: "Phases",
      key: "phases",
      style: { width: "20%" },
      renderItem: ({ data }) => {
        const phases = data?.phases || [];
        const phaseNames = phases.map((p) => `${p.order}. ${p.name}`).join(", ");
        return (
          <div className={classes.phasesContainer}>
            <span 
              className={classes.phasesCount} 
              title={phaseNames || "No phases"}
            >
              {phases.length} phases
            </span>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      renderItem: ({ item, data }) => {
        return <Status label={item} variant={data.statusVariant} />;
      },
      style: { width: "15%" },
    },
    {
      title: "Actions",
      key: "viewDetails",
      style: { width: "15%" },
      renderItem: ({ data }) => {
        return (
          <div
            className={classes.viewDetailsLink}
            onClick={() => {
              setSelectedData(data);
              setShowAddNewCaseTypeModal(true);
            }}
          >
            Edit Details
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getCaseTypeData({ _status: status, _page: 1 });
  }, [debouncedSearch, status]);

  return (
    <div className="p24">
      <Wrapper
        headerComponent={
          <TableHeader
            title="Case Type Management"
            titleIcon={<MdOutlineAssignment color="#D9D9D9" size={28} />}
            searchValue={searchValue}
            onSearchChange={(value) => {
              setPage(1);
              setSearchValue(value);
            }}
            searchPlaceholder="Search..."
            onFilterClick={handleFilterClick}
            filterOptions={filterOptions}
            viewButtonText="Add New Case Type"
            onClickViewAll={() => {
              setSelectedData(null);
              setShowAddNewCaseTypeModal(true);
            }}
          />
        }
        contentClassName={classes.contentClassName}
      >
        <ResponsiveTable
          tableHeader={caseTypeTableHeader}
          data={data}
          pagination={true}
          page={page}
          totalRecords={totalRecords}
          onPageChange={(page) => {
            setPage(page);
            getCaseTypeData({ _status: status, _page: page });
          }}
        />
      </Wrapper>
      <CreateCaseTypeModal
        show={showAddNewCaseTypeModal}
        setShow={(value) => {
          setShowAddNewCaseTypeModal(value);
          if (!value) {
            setSelectedData(null);
          }
        }}
        selectedData={selectedData}
        getCaseTypeData={getCaseTypeData}
      />
      {loading === "loading" && <CircularLoadingComponent />}
    </div>
  );
};
export default CaseTypeTemplate;
