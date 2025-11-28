"use client";
import React, { useState } from "react";
import classes from "./UserManagementDetailTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Button from "@/components/atoms/Button";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Col, Row } from "react-bootstrap";
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import DetailActionsWithStats from "@/components/atoms/DetailActionsWithStats/DetailActionsWithStats";
import { caseManagementCardsData, caseProgressCardsData } from "@/developementContent/Data/dummtData/dummyData";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import { RiKeyFill } from "react-icons/ri";
import StatusChip from "@/components/atoms/StatusChip/StatusChip";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import { reactActivities } from "@/developementContent/Enums/enum";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { staffDashboardTableBody } from "@/developementContent/TableBody/StaffDashboardTableBody";

const UserManagementDetailTemplate = ({ role = "client", permissions = [] }) => {
  const router = useRouter();
  const isStaff = role === "staff";
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(reactActivities[0]);
  
  // Default permissions for staff if none provided
  const defaultPermissions = ["Case Management", "Case Creation", "Case Assignment"];
  const staffPermissions = permissions.length > 0 ? permissions : defaultPermissions;
  
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
                  <h4>Herman Schoen</h4>
                </div>
                {!isStaff && (
                  <div className={classes.userDetailItem}>
                    <div className={classes.userDetailItemTitle}>
                      <MdOutlineEmail size={16} color="#8484AE" />
                      <h5>Email</h5>
                    </div>
                    <h4>herman.schoen@example.com</h4>
                  </div>
                )}
                {isStaff && (
                  <div className={classes.userDetailItem}>
                    <div className={classes.userDetailItemTitle}>
                      <RiKeyFill size={16} color="#8484AE" />
                      <h5>Permissions</h5>
                    </div>
                    <div className={classes.permissionsContainer}>
                      {staffPermissions?.map((permission, index) => (
                        <StatusChip key={index} bgColor="rgba(240, 240, 245, 0.50)">
                          {permission}
                        </StatusChip>
                      ))}
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
                  statsData={[
                    { title: "Total Cases", value: 6 },
                    { title: "Active Cases", value: 2 },
                    { title: "Completed Cases", value: 4 },
                  ]}
                  statusClassName={classes.status}
                  deactivateButtonClassName={classes.deactivateButton}
                  editButtonClassName={classes.editButton}
                />
              </div>
          
              </Col>
            </Row>
            <Row className="g-4 mt-4">
          {!isStaff && caseManagementCardsData?.map((item) => (
            <Col className="col-12 col-md-4" key={item.id}>
              <CaseProgressCard 
                isStatusVariant
                routePath={`/case-management/${item.id}`}
                data={{
                  tabLabel: item.tabLabel,
                  userName: item.userName,
                  progress: item.progress,
                  status: item.status,
                  trademarkName: item.trademarkName,
                  trademarkNo: item.trademarkNo,
                  deadline: item.deadline,
                  clientName: item.clientName
                }}
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
                />
              }
              className={classes.wrapper}
              contentClassName={classes.contentClassName}
            >
              <ResponsiveTable
                tableHeader={staffDashboardTableHeader}
                data={staffDashboardTableBody}
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
