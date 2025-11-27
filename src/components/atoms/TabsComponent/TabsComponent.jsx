"use client";
import React, { useState, useEffect } from 'react'
import classes from "./TabsComponent.module.css"

export default function TabsComponent({ onTabChange, defaultTab = 'staff' }) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  useEffect(() => {
    if (onTabChange) {
      onTabChange(selectedTab);
    }
  }, [selectedTab, onTabChange]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className={classes.tabsContainer}>
      <button
        className={`${classes.tab} ${selectedTab === 'staff' ? classes.tabActive : classes.tabInactive}`}
        onClick={() => handleTabClick('staff')}
      >
        Staff Users
      </button>
      <button
        className={`${classes.tab} ${selectedTab === 'client' ? classes.tabActive : classes.tabInactive}`}
        onClick={() => handleTabClick('client')}
      >
        Client Users
      </button>
    </div>
  )
}
