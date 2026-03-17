import { Box } from '@mui/material';
import * as React from 'react';

import { Head } from '../seo';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <Box sx={{ flexGrow: 1, p: 4 }}>{children}</Box>
    </>
  );
};
