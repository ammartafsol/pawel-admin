import UserManagementDetailTemplate from "@/components/Template/Staff/UserManagementDetailTemplate/UserManagementDetailTemplate";
import React from "react";

const page = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { role } = await searchParams;

  return (
    <>
      <UserManagementDetailTemplate role={role || "client"} />
    </>
  );
};

export default page;
