"use client";
import Button from "@/components/atoms/Button";
import TabsComponent from "@/components/atoms/TabsComponent/TabsComponent";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import AddNewStaffModal from "@/components/organisms/Modals/AddNewStaffModal/AddNewStaffModal";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { userManagementTableBody } from "@/developementContent/TableBody/UserManagementTableBody";
import { userManagementTableHeader } from "@/developementContent/TableHeader/UserManagementTableHeader";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import classes from "./UserManagementTemplate.module.css";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";
import { RECORDS_LIMIT } from "@/resources/utils/constant";

const UserManagementTemplate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("staff");
  const [showAddNewStaffModal, setShowAddNewStaffModal] = useState(false);
  const [loading, setLoading] = useState({
    getAllUsers: false,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableData, setTableData] = useState([]);
  const { Get } = useAxios();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const handleFilterClick = () => {
    // Filter functionality can be implemented here
    console.log("Filter clicked");
  };

  const filterOptions = [
    {
      label: "All Users",
      value: "all",
      onClick: () => {
        console.log("Filter: All Users");
      },
    },
    {
      label: "Active Users",
      value: "active",
      onClick: () => {
        console.log("Filter: Active Users");
      },
    },
    {
      label: "Inactive Users",
      value: "inactive",
      onClick: () => {
        console.log("Filter: Inactive Users");
      },
    },
    {
      label: "Pending Cases",
      value: "pending",
      onClick: () => {
        console.log("Filter: Pending Approval");
      },
    },
  ];

  const tableHeaders = useMemo(() => {
    const headers = [...userManagementTableHeader];

    // Update first column title based on selected tab
    if (headers.length > 0) {
      headers[0].title = selectedTab === "staff" ? "Staff Name" : "Client Name";
    }

    // Update the View Details link to include role query parameter
    const viewDetailsIndex = headers.findIndex((h) => h.key === "viewDetails");
    if (viewDetailsIndex !== -1) {
      headers[viewDetailsIndex] = {
        ...headers[viewDetailsIndex],
        renderItem: ({ data }) => {
          return (
            <Link
              href={`/user-management/${data.id}?role=${selectedTab}`}
              className={classes.viewDetailsLink}
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          );
        },
      };
    }

    // Add Permissions column for staff tab
    if (selectedTab === "staff") {
      // Check if Permissions column already exists
      const permissionsIndex = headers.findIndex(
        (h) => h.key === "permissions"
      );
      if (permissionsIndex === -1) {
        // Insert Permissions column after Number of Cases
        const numberOfCasesIndex = headers.findIndex(
          (h) => h.key === "numberOfCases"
        );
        const insertIndex =
          numberOfCasesIndex !== -1 ? numberOfCasesIndex + 1 : 2;

        headers.splice(insertIndex, 0, {
          title: "Permissions",
          key: "permissions",
          style: { width: "15%" },
          renderItem: ({ data }) => {
            const count = data.permissionsCount || 0;
            return (
              <div className={classes.permissionsContainer}>
                <span className={classes.permissionsText}>Case Management</span>
                <div className={classes.permissionsBadge}>+{count}</div>
              </div>
            );
          },
        });
      }
    } else {
      // Remove Permissions column for client tab
      const permissionsIndex = headers.findIndex(
        (h) => h.key === "permissions"
      );
      if (permissionsIndex !== -1) {
        headers.splice(permissionsIndex, 1);
      }
    }

    return headers;
  }, [selectedTab]);

  // getAllUsers
  const getAllUsers = async ({
    _pg = page,
    _search = search,
    _status = status,
  }) => {
    setLoading((prev) => ({ ...prev, getAllUsers: true }));
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
      route: `admin/user?${queryParams}`,
      data: body,
    });
    if (response) {
      setTableData(response?.data);
      setTotalRecords(response?.totalRecords);
    }
    setLoading((prev) => ({ ...prev, getAllUsers: false }));
  };
  // useEffect(() => {
  //   getAllUsers({
  //     _pg: 1,
  //     _search: debouncedSearch,
  //     _status: status,
  //   });
  // }, [debouncedSearch, status]);

  return (
    <div className="p24">
      <div className={classes.tabBtnContainer}>
        <TabsComponent onTabChange={setSelectedTab} defaultTab="staff" />
        {selectedTab === "staff" && (
          <Button
            onClick={() => {
              setShowAddNewStaffModal(true);
            }}
            className={classes?.viewAllBtn}
            leftIcon={<IoAddCircle size={20} color="var(--white)" />}
            label={"Add New Staff"}
            variant="primary"
          />
        )}
      </div>
      <Wrapper
        headerComponent={
          <TableHeader
            title="User Management"
            titleIcon={<FaRegUser color="#D9D9D9" size={20} />}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search..."
            onFilterClick={handleFilterClick}
            filterOptions={filterOptions}
          />
        }
        contentClassName={classes.contentClassName}
      >
        <ResponsiveTable
          tableHeader={tableHeaders}
          data={userManagementTableBody}
          // data={tableData}
          pagination={true}
          totalRecords={totalRecords}
          page={page}
          onPageChange={(page) => {
            setPage(page);
            getAllUsers({
              _pg: page,
              _search: debouncedSearch,
              _status: status,
            });
          }}
          noDataText={"No Users Found"}
          loading={loading?.getAllUsers}
        />
      </Wrapper>
      <AddNewStaffModal
        show={showAddNewStaffModal}
        setShow={setShowAddNewStaffModal}
      />
    </div>
  );
};

export default UserManagementTemplate;
