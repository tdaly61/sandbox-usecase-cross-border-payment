import { Button } from '@mui/material';

export const MainErrorFallback = () => {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <Button onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </div>
  );
};
