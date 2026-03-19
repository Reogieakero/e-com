import { useState } from 'react';

export const useSidebar = (initialView = 'dashboard') => {
  const [activeView, setActiveView] = useState(initialView);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (viewId) => {
    setActiveView(viewId);
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return {
    activeView,
    isCollapsed,
    handleNavigate,
    toggleSidebar
  };
};