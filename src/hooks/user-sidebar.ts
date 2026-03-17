import { useCallback, useState } from 'react';

export const useSidebar = (initial = true) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initial);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((state) => !state), []);

  return { isSidebarOpen, openSidebar, closeSidebar, toggleSidebar };
};
