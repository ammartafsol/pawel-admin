"use client";
import Button from "@/components/atoms/Button";
import DetailActionsWithStats from "@/components/atoms/DetailActionsWithStats/DetailActionsWithStats";
import StatusChip from "@/components/atoms/StatusChip/StatusChip";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { caseManagementCardsData } from "@/developementContent/Data/dummtData/dummyData";
import { reactActivities } from "@/developementContent/Enums/enum";
import { staffDashboardTableBody } from "@/developementContent/TableBody/StaffDashboardTableBody";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FiUser } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { RiKeyFill } from "react-icons/ri";
import classes from "./UserManagementDetailTemplate.module.css";
import useAxios from "@/interceptor/axios-functions";
import { useEffect } from "react";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import useDebounce from "@/resources/hooks/useDebounce";

const UserManagementDetailTemplate = ({
  slug,
  role = "client",
  permissions = [],
}) => {
  const router = useRouter();
  const { Get } = useAxios();
  const isStaff = role === "staff";
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(
    reactActivities[0]
  );
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState({
    getUserDetails: false,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  // Default permissions for staff if none provided
  const defaultPermissions = [
    "Case Management",
    "Case Creation",
    "Case Assignment",
  ];
  const staffPermissions =
    permissions.length > 0 ? permissions : defaultPermissions;

  // getUserDetails
  const getUserDetails = async ({
    _pg = page,
    _search = search,
    _status = selectedDropdownValue,
  }) => {
    setLoading((prev) => ({ ...prev, getUserDetails: true }));
    const body = {
      search: _search,
      limit: RECORDS_LIMIT,
      page: _pg,
      ...(_status && _status !== "all" && { status: _status?.value }),
    };
    const queryParams = new URLSearchParams(body).toString();
    const { response } = await Get({
      route: `admin/user/${slug}?${queryParams}`,
      data: body,
    });
    if (response) {
      setUserDetails(response?.data);
      setTableData(response?.data?.activities);
      setTotalRecords(response?.totalRecords);
    }
    setLoading((prev) => ({ ...prev, getUserDetails: false }));
  };

  // useEffect(() => {
  //   getUserDetails();
  // }, []);

  return (
    <div className="p24">
      <Wrapper
        contentClassName={classes.contentClassName}
        headerComponent={
          <div className={classes.backButtonContainer}>
            <Button
              className={classes.backButton}
              variant="outlined"
              leftIcon={<IoChevronBack color="#151529" />}
              label="Back"
              onClick={() => router.back()}
            />
          </div>
        }
      >
        <div className={classes.content}>
          <div className={classes.userDetailContainer}>
            <Row>
              <Col md={6}>
                <div className={classes.userDetailItemContainer}>
                  <div className={classes.userDetailItem}>
                    <div className={classes.userDetailItemTitle}>
                      <FiUser size={16} color="#8484AE" />
                      <h5>{isStaff ? "Staff Name" : "Client Name"}</h5>
                    </div>
                    <h4>{userDetailsData?.name}</h4>
                  </div>
                  {!isStaff && (
                    <div className={classes.userDetailItem}>
                      <div className={classes.userDetailItemTitle}>
                        <MdOutlineEmail size={16} color="#8484AE" />
                        <h5>Email</h5>
                      </div>
                      <h4>{userDetailsData?.email}</h4>
                    </div>
                  )}
                  {isStaff && (
                    <div className={classes.userDetailItem}>
                      <div className={classes.userDetailItemTitle}>
                        <RiKeyFill size={16} color="#8484AE" />
                        <h5>Permissions</h5>
                      </div>
                      <div className={classes.permissionsContainer}>
                        {userDetailsData?.permissions?.map(
                          (permission, index) => (
                            <StatusChip
                              key={index}
                              bgColor="rgba(240, 240, 245, 0.50)"
                            >
                              {permission}
                            </StatusChip>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className={classes.userDetailItemContainerRight}>
                  <DetailActionsWithStats
                    statusLabel="Active"
                    statusVariant="success"
                    statsData={userDetailsData?.statsData}
                    statusClassName={classes.status}
                    deactivateButtonClassName={classes.deactivateButton}
                    editButtonClassName={classes.editButton}
                  />
                </div>
              </Col>
            </Row>
            <Row className="g-4 mt-4">
              {!isStaff &&
                caseManagementCardsData?.map((item) => (
                  <Col className="col-12 col-md-4" key={item.id}>
                    <CaseProgressCard
                      isStatusVariant
                      routePath={`/case-management/${item.id}`}
                      data={item}
                    />
                  </Col>
                ))}
              {isStaff && (
                <Col>
                  <Wrapper
                    headerComponent={
                      <TableHeader
                        viewButtonText="View All"
                        onClickViewAll={() => router.push("/case-management")}
                        title="Activities"
                        dropdownOptions={reactActivities}
                        dropdownPlaceholder="Select Activity"
                        selectedDropdownValue={selectedDropdownValue}
                        setSelectedDropdownValue={setSelectedDropdownValue}
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
                      // data={tableData}
                      pagination={true}
                      totalRecords={totalRecords}
                      page={page}
                      onPageChange={(page) => {
                        setPage(page);
                        getUserDetails({
                          _pg: page,
                          _search: debouncedSearch,
                          _status: selectedDropdownValue,
                        });
                      }}
                      noDataText={"No Activities Found"}
                      loading={loading?.getUserDetails}
                    />
                  </Wrapper>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default UserManagementDetailTemplate;

const userDetailsData = {
  name: "Herman Schoen",
  email: "herman.schoen@example.com",
  permissions: ["Case Management", "Case Creation", "Case Assignment"],
  statsData: [
    { title: "Total Cases", value: 6 },
    { title: "Active Cases", value: 2 },
    { title: "Completed Cases", value: 4 },
  ],
};
