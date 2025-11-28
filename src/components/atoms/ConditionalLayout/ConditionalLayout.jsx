"use client";
import { usePathname } from "next/navigation";
import StaffLayout from "@/components/atoms/StaffLayout/StaffLayout";

const ConditionalLayout = ({ children }) => {
  const pathname = usePathname();
  
  // Auth routes that should not have StaffLayout
  const authRoutes = [
    "/forgot-password",
    "/login",
    "/reset-password",
    "/sign-up",
    "/verify-otp",
  ];
  
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  
  if (isAuthRoute) {
    return <>{children}</>;
  }
  
  return <StaffLayout>{children}</StaffLayout>;
};

export default ConditionalLayout;

