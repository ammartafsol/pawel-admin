"use client";
import React, { useEffect, useState } from "react";
import classes from "./CaseManagementTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import {
  caseStatusFilters,
  reactActivities,
} from "@/developementContent/Enums/enum";
import { FaRegFolderClosed } from "react-icons/fa6";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import { Col, Row } from "react-bootstrap";
import { caseManagementCardsData } from "@/developementContent/Data/dummtData/dummyData";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";
import useDebounce from "@/resources/hooks/useDebounce";
import useAxios from "@/interceptor/axios-functions";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import CircularLoadingComponent from "@/components/atoms/CircularLoadingComponent/CircularLoadingComponent";
const CaseManagementTemplate = () => {
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [status, setStatus] = useState(caseStatusFilters[0]);
  const [loading, setLoading] = useState({
    getCaseManagementData: false,
  });
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const { Get } = useAxios();

  const getCaseManagementData = async ({
    _pg = page,
    _search = search,
    _status = status,
  }) => {
    setLoading((prev) => ({ ...prev, getCaseManagementData: true }));
    const body = {
      search: _search,
      limit: RECORDS_LIMIT,
      page: _pg,
      ...(_status &&
        _status !== "all" &&
        _status?.value !== "all" && { status: _status?.value }),
    };
    const queryString = new URLSearchParams(body).toString();
    const { response } = await Get({
      route: `admin/cases?${queryString}`,
      data: body,
    });
    if (response) {
      setTotalRecords(response?.totalRecords);
      setData(response?.data || []);
    }
    setLoading((prev) => ({ ...prev, getCaseManagementData: false }));
  };

  // useEffect(()=>{
  //   getCaseManagementData({ _page: page, _search: debounceSearch, _status: status });
  // },[debounceSearch,page]);

  return (
    <div className="p24">
      <Wrapper
        headerComponent={
          <TableHeader
            viewButtonText="Create new case"
            searchValue={search}
            onSearchChange={setSearch}
            onClickViewAll={() => setShowCreateNewCaseModal(true)}
            dropdownOptions={caseStatusFilters}
            selectedDropdownValue={status}
            setSelectedDropdownValue={setStatus}
            title="Case Management"
            titleIcon={<FaRegFolderClosed color="#D9D9D9" size={20} />}
          />
        }
      >
        {loading?.getCaseManagementData && <CircularLoadingComponent />}
        <div className={classes.caseManagementCards}>
          <Row className="g-4">
            {caseManagementCardsData.map((item) => (
              <Col className="col-12 col-md-4" key={item?.id}>
                <CaseProgressCard
                  isStatusVariant
                  routePath={`/case-management/${item?.id}`}
                  data={item}
                  // data={
                  // tabLabel: item.tabLabel,
                  // userName: item.userName,
                  // progress: item.progress,
                  // status: item.status,
                  // trademarkName: item.trademarkName,
                  // trademarkNo: item.trademarkNo,
                  // deadline: item.deadline,
                  // clientName: item.clientName,
                  // }
                />
              </Col>
            ))}
          </Row>
        </div>
      </Wrapper>
      <CreateNewCaseModal
        show={showCreateNewCaseModal}
        setShow={setShowCreateNewCaseModal}
      />
    </div>
  );
};

export default CaseManagementTemplate;
