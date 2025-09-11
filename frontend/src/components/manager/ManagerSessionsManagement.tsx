'use client';

import React from 'react';
import SessionSchedulesManagement from '../admin/SessionSchedulesManagement';

const ManagerSessionsManagement = () => {
  return (
    <SessionSchedulesManagement 
      userRole="manager" 
      viewMode="management" 
    />
  );
};

export default ManagerSessionsManagement;
