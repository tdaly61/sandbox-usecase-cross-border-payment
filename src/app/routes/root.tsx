import { Outlet } from 'react-router-dom';

import { PageLayout } from '@/components/layouts';

export const AppRoot = () => {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
};

export const AppRootErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};
