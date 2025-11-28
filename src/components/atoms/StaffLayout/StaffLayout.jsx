"use client";
import React, { useEffect, useRef, useState } from "react";
import classes from "./StaffLayout.module.css";
import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import { MdNotifications } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { signOutRequest } from "@/store/auth/authSlice";

const StaffLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOverlayOpen(false);
      }
    };

    if (isProfileOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOverlayOpen]);

  const handleProfileClick = () => {
    setIsProfileOverlayOpen(!isProfileOverlayOpen);
  };

  const handleProfileSettings = () => {
    router.push("/profile-setting");
    setIsProfileOverlayOpen(false);
  };



  const handleLogout = () => {
    dispatch(signOutRequest());
    router.push("/login");
    setIsProfileOverlayOpen(false);
  };

  const handleNotificationsClick = () => {
    router.push("/notifications");
    setIsProfileOverlayOpen(false);
  };


  return (
    <div className={`${classes?.staffLayout}`}>
      <Sidebar />
      <div className={classes?.rightSide}>
        {/*  right side header */}
        <div className={classes?.rightSideHeader}>
          <div className={classes?.mainIcon}>
            <div onClick={handleNotificationsClick} className={classes?.icon}>
              <MdNotifications size={22} color="var(--white)" />
            </div>
            <div
              ref={profileRef}
              className={classes?.profileIconWrapper}
            >
              <div
                onClick={handleProfileClick}
                className={`${classes?.icon} ${isProfileOverlayOpen ? classes?.iconActive : ""}`}
              >
                <CgProfile size={22} color="var(--white)" />
              </div>
              {isProfileOverlayOpen && (
                <div className={classes?.profileOverlay}>
                  <div
                    className={classes?.profileOverlayItem}
                    onClick={handleProfileSettings}
                  >
                    <IoSettingsOutline size={18} />
                    <span>Profile Settings</span>
                  </div>
                  <div
                    className={classes?.profileOverlayItem}
                    onClick={handleLogout}
                  >
                    <IoLogOutOutline size={18} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={classes?.rightSideContent}>{children}</div>
      </div>
    </div>
  );
};

export default StaffLayout;
