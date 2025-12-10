"use client";
import Button from "@/components/atoms/Button";
import DocCard from "@/components/atoms/DocCard/DocCard";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import ActivityLog from "@/components/molecules/ActivityLog/ActivityLog";
import Calender from "@/components/molecules/Calender/Calender";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import EvidenceTableTop from "@/components/molecules/EvidenceTableTop/EvidenceTableTop";
import Notes from "@/components/molecules/Notes/Notes";
import TabFilter from "@/components/molecules/TabFilter/TabFilter";
import {
  myEventsList,
  caseManagementDetailData,
} from "@/developementContent/Data/dummtData/dummyData";
import {
  auditTrackingOptions,
  caseDetailTabs,
} from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BiFilterAlt } from "react-icons/bi";
import { IoChevronBack } from "react-icons/io5";
import { MdAddCircle } from "react-icons/md";
import classes from "./CaseManagementDetailTemplate.module.css";
import useAxios from "@/interceptor/axios-functions";
import CircularLoadingComponent from "@/components/atoms/CircularLoadingComponent/CircularLoadingComponent";

const CaseManagementDetailTemplate = ({ slug }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(auditTrackingOptions[0]);
  const [activeTab, setActiveTab] = useState(caseDetailTabs[0].value);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
  const fileInputRef = useRef(null);
  const filterRef = useRef(null);
  const router = useRouter();
  const [detailData, setDetailData] = useState(caseManagementDetailData);
  const [loading, setLoading] = useState({
    getCaseManagementDetailData: false,
    getAuditTracking: false,
  });
  const { Get } = useAxios();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOverlayOpen(false);
      }
    };

    if (isFilterOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOverlayOpen]);

  const handleFilterIconClick = () => {
    setIsFilterOverlayOpen(!isFilterOverlayOpen);
  };

  const handleFilterOptionClick = (onClick) => {
    onClick();
    setIsFilterOverlayOpen(false);
  };

  const filterOptions = [
    {
      label: "All",
      onClick: () => {
        console.log("Filter: All");
      },
    },
    {
      label: "Latest",
      onClick: () => {
        console.log("Filter: Latest");
      },
    },
  ];

  const handleUploadDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Handle file selection here
      console.log("Selected files:", selectedFiles);
      // You can add your file upload logic here
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const documents = [
    {
      id: "document-1",
      title: "Document 1",
      dateTime: "12/29/2023 10:20",
      visibilityText: "Visible to client",
    },
    {
      id: "document-2",
      title: "Document 2",
      dateTime: "12/29/2023 10:20",
      visibilityText: null,
    },
    {
      id: "document-3",
      title: "Document 3",
      dateTime: "12/29/2023 10:20",
      visibilityText: null,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className={classes.notesContainer}>
            <Notes
              showAddNoteModal={showAddNoteModal}
              setShowAddNoteModal={setShowAddNoteModal}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
        );
      case "activityLog":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDiv}>
              <h5>Recent activities</h5>
            </div>
            <div className={classes.activityListContainer}>
              <ActivityLog activities={detailData?.activities} />
            </div>
          </div>
        );
      case "documents":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDivDoc}>
              <h5>Case documents</h5>
              <div className={classes.docsHeaderRight}>
                {/* Temporarily open file browsing: */}
                <Button
                  label="Upload Document"
                  className={classes.uploadDocumentButton}
                  leftIcon={<MdAddCircle color="var(--white)" size={20} />}
                  onClick={handleUploadDocument}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                />
                <SearchInput value={searchValue} setValue={setSearchValue} />
                <div className={classes.filterWrapper} ref={filterRef}>
                  <div
                    className={`${classes.filterIcon} ${
                      isFilterOverlayOpen ? classes.filterIconActive : ""
                    }`}
                    onClick={handleFilterIconClick}
                  >
                    <BiFilterAlt size={20} color="var(--black)" />
                  </div>
                  {isFilterOverlayOpen && filterOptions.length > 0 && (
                    <div className={classes.filterOverlay}>
                      {filterOptions.map((option, index) => (
                        <div
                          key={index}
                          className={classes.filterOption}
                          onClick={() =>
                            handleFilterOptionClick(
                              option.onClick || (() => {})
                            )
                          }
                        >
                          {option?.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={classes.docListContainer}>
              {detailData?.documents?.map((doc) => (
                <DocCard key={doc.id} data={doc} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // detail
  const getCaseManagementDetailData = async () => {
    setLoading((prev) => ({ ...prev, getCaseManagementDetailData: true }));
    const { response } = await Get({
      route: `admin/cases/${slug}`,
    });
    if (response) {
      setDetailData(response?.data);
    }
    setLoading((prev) => ({ ...prev, getCaseManagementDetailData: false }));
  };
  // useEffect(() => {
  //   getCaseManagementDetailData();
  // }, [slug]);
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
        <div className={classes?.content}>
          {loading?.getCaseManagementDetailData && <CircularLoadingComponent />}
          <Row>
            <Col md={4}>
              <CaseProgressCard
                // for api
                // data={detailData}
                data={caseManagementDetailData}
                // isAssignedStaffVariant
                isCaseDetailVariant
              />
            </Col>
            <Col md={8}>
              <Wrapper
                headerComponent={
                  <EvidenceTableTop
                    title="Audit Tracking"
                    placeholder="Select..."
                    selectedValue={selectedValue}
                    options={auditTrackingOptions}
                    setSelectedValue={setSelectedValue}
                  />
                }
              >
                <Calender
                  events={myEventsList}
                  loading={loading?.getAuditTracking}
                />
              </Wrapper>

              <Wrapper
                contentClassName={classes?.contentClassName}
                headerComponent={
                  <TabFilter
                    tabs={caseDetailTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                }
              >
                {renderTabContent()}
              </Wrapper>
            </Col>
          </Row>
        </div>
      </Wrapper>
    </div>
  );
};

export default CaseManagementDetailTemplate;
