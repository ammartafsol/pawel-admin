"use client";
import React, { useState, useEffect } from "react";
import classes from "./DashboardTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import CalenderHeaderDrop from "@/components/atoms/TableHeaderDrop/CalenderHeaderDrop";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import { newCasesData } from "@/developementContent/Data/data";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { staffDashboardTableBody } from "@/developementContent/TableBody/StaffDashboardTableBody";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import {
  caseStatusFilters,
  reactActivities,
} from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";

const DashboardTemplate = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(caseStatusFilters[0]);
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState({
    getEventsSlots: false,
    getAllActivities: false,
  });
  const [page, setPage] = useState(1);
  const { Get } = useAxios();
  // const [tableData, setTableData] = useState();

  const [totalRecords, setTotalRecords] = useState(0);
  const debouncedSearch = useDebounce(search, 500);

  // recent activities
  const getAllActivities = async ({
    _pg = page,
    _search = search,
    _status = status,
  }) => {
    setLoading((prev) => ({ ...prev, getAllActivities: true }));
    const body = {
      search: _search,
      limit: RECORDS_LIMIT,
      page: _pg,
      ...(_status &&
        _status !== "all" &&
        status?.value !== "all" && { status: _status?.value }),
    };
    const queryParams = new URLSearchParams(body).toString();
    const { response } = await Get({
      route: `admin/activities?${queryParams}`,
      data: body,
    });
    if (response) {
      setTableData(response?.data);
      setTotalRecords(response?.totalRecords);
    }
    setLoading((prev) => ({ ...prev, getAllActivities: false }));
  };
  // useEffect(() => {
  //   getAllActivities({
  //     _pg: 1,
  //     _search: debouncedSearch,
  //     _status: status,
  //   });
  // }, [debouncedSearch, status]);

  const handleDropdownChange = (value) => {
    setStatus(value);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <div>
      <div className={classes?.dashboardTemplateHeader}>
        <h4>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h4>
        <p>{getGreeting()}, John Doe.</p>
      </div>
      <div className="p24">
        <Row>
          <Col lg={7}>
            <Wrapper
              contentClassName={classes?.calenderWrapper}
              headerComponent={<CalenderHeaderDrop />}
            >
              <Calender
                className={classes?.calender}
                events={myEventsList}
                loading={loading?.getEventsSlots}
              />
            </Wrapper>
          </Col>
          <Col lg={5}>
            <div className={classes?.newCases}>
              <Row className="g-4">
                {newCasesData.map((item) => (
                  <Col md={6} key={item.id}>
                    <ActionCard
                      {...item}
                      title={item.title}
                      image={item.image}
                      onClick={
                        item.title === "Create New Case"
                          ? () => setShowCreateNewCaseModal(true)
                          : item.title === "Add a Document"
                          ? () => {
                              router.push("/document-management");
                            }
                          : undefined
                      }
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Wrapper
              headerComponent={
                <TableHeader
                  viewButtonText="View All"
                  onClickViewAll={() => router.push("/case-management")}
                  title="Recent Activities"
                  dropdownOptions={caseStatusFilters}
                  dropdownPlaceholder="Select Activity"
                  selectedDropdownValue={status}
                  setSelectedDropdownValue={setStatus}
                  searchValue={search}
                  onSearchChange={setSearch}
                />
              }
              className={classes.wrapper}
              contentClassName={classes.contentClassName}
            >
              <ResponsiveTable
                tableHeader={staffDashboardTableHeader}
                data={staffDashboardTableBody}
                noDataText={"No Recent Activities Found"}
                // data={tableData}
                pagination={true}
                // loading={loading?.getAllActivities}
                page={page}
                totalRecords={totalRecords}
                // onPageChange={(page) => {
                //   setPage(page);
                //   getAllActivities({
                //     _pg: page,
                //     _search: debouncedSearch,
                //     _status: status,
                //   });
                // }}
              />
            </Wrapper>
          </Col>
        </Row>
      </div>
      <CreateNewCaseModal
        show={showCreateNewCaseModal}
        setShow={setShowCreateNewCaseModal}
      />
    </div>
  );
};

export default DashboardTemplate;
