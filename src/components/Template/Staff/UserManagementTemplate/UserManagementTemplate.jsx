"use client";
import React, { useState, useMemo } from 'react';
import classes from "./UserManagementTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import AppTable from '@/components/organisms/AppTable/AppTable';
import { userManagementTableHeader } from '@/developementContent/TableHeader/UserManagementTableHeader';
import { userManagementTableBody } from '@/developementContent/TableBody/UserManagementTableBody';
import { FaRegUser } from "react-icons/fa";
import ResponsiveTable from '@/components/organisms/ResponsiveTable/ResponsiveTable';
import TabsComponent from '@/components/atoms/TabsComponent/TabsComponent';
import Button from '@/components/atoms/Button';
import { IoAddCircle } from "react-icons/io5";
import Link from "next/link";

const UserManagementTemplate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTab, setSelectedTab] = useState('staff');

  const handleFilterClick = () => {
    // Filter functionality can be implemented here
    console.log("Filter clicked");
  };

  const filterOptions = [
    {
      label: "All Users",
      onClick: () => {
        console.log("Filter: All Users");
      }
    },
    {
      label: "Active Users",
      onClick: () => {
        console.log("Filter: Active Users");
      }
    },
    {
      label: "Inactive Users",
      onClick: () => {
        console.log("Filter: Inactive Users");
      }
    },
    {
      label: "Pending Cases",
      onClick: () => {
        console.log("Filter: Pending Approval");
      }
    }
  ];

  const tableHeaders = useMemo(() => {
    const headers = [...userManagementTableHeader];
    
    // Update first column title based on selected tab
    if (headers.length > 0) {
      headers[0].title = selectedTab === 'staff' ? 'Staff Name' : 'Client Name';
    }

    // Update the View Details link to include role query parameter
    const viewDetailsIndex = headers.findIndex(h => h.key === 'viewDetails');
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
    if (selectedTab === 'staff') {
      // Check if Permissions column already exists
      const permissionsIndex = headers.findIndex(h => h.key === 'permissions');
      if (permissionsIndex === -1) {
        // Insert Permissions column after Number of Cases
        const numberOfCasesIndex = headers.findIndex(h => h.key === 'numberOfCases');
        const insertIndex = numberOfCasesIndex !== -1 ? numberOfCasesIndex + 1 : 2;
        
        headers.splice(insertIndex, 0, {
          title: "Permissions",
          key: "permissions",
          style: { width: "15%" },
          renderItem: ({ data }) => {
            const count = data.permissionsCount || 0;
            return (
              <div className={classes.permissionsContainer}>
                <span className={classes.permissionsText}>Case Management</span>
                <div className={classes.permissionsBadge}>
                  +{count}
                </div>
              </div>
            );
          },
        });
      }
    } else {
      // Remove Permissions column for client tab
      const permissionsIndex = headers.findIndex(h => h.key === 'permissions');
      if (permissionsIndex !== -1) {
        headers.splice(permissionsIndex, 1);
      }
    }

    return headers;
  }, [selectedTab]);

  return (
    <div className='p24'>
      <div className={classes.tabBtnContainer}>
        <TabsComponent onTabChange={setSelectedTab} defaultTab="staff"/>
          {selectedTab === 'staff' && (
            <Button 
              onClick={() => {}} 
              className={classes?.viewAllBtn} 
              leftIcon={<IoAddCircle size={20} color="var(--white)" />} 
              label={'Add New User'}
              variant="primary"
            />
          )}
      </div>
      <Wrapper 
        headerComponent={
          <TableHeader 
            title="User Management" 
            titleIcon={<FaRegUser color='#D9D9D9' size={20} />}
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
        />
      </Wrapper>
    </div>
  )
}

export default UserManagementTemplate