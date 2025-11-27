"use client";
import React, { useState } from 'react'
import classes from "./TabsComponent.module.css"

export default function TabsComponent() {
  const [selectedTab, setSelectedTab] = useState('staff');

  return (
    <div className={classes.tabsContainer}>
      <button
        className={`${classes.tab} ${selectedTab === 'staff' ? classes.tabActive : classes.tabInactive}`}
        onClick={() => setSelectedTab('staff')}
      >
        Staff Users
      </button>
      <button
        className={`${classes.tab} ${selectedTab === 'client' ? classes.tabActive : classes.tabInactive}`}
        onClick={() => setSelectedTab('client')}
      >
        Client Users
      </button>
    </div>
  )
}
