import React from 'react';

import { ContentLayout } from '@/components/layouts';
import { DashboardView } from '@/features/dashboard/components/dashboard-view';

export const DashboardRoute = () => {
    return (
        <ContentLayout title="Dashboard">
            <DashboardView />
        </ContentLayout>
    );
};
