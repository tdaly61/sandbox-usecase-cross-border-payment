import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { LoginInput, loginInputSchema, useLogin } from '@/lib/auth';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({
    onSuccess,
  });
  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: 'firstUser@test.com',   // 👈 pre-filled email
      password: 'asdf1234',          // 👈 pre-filled password
    },
  });

  const onSubmit = (data: LoginInput) => {
    login.mutate(data);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: 4,
        gap: 4,
        margin: 'auto',
        maxWidth: 486,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
            <FormControl>
              <TextField
                name="email"
                label="Email"
                placeholder="firstUser@test.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                inputRef={ref}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
                sx={{ ariaLabel: 'email' }}
              />
              <FormHelperText sx={{ color: 'error.main' }}>{error?.message ?? ''}</FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
            <FormControl>
              <TextField
                name="password"
                label="Password"
                placeholder="••••••"
                type="password"
                autoComplete="asdf1234"
                required
                fullWidth
                variant="outlined"
                inputRef={ref}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
              />
              <FormHelperText sx={{ color: 'error.main' }}>{error?.message ?? ''}</FormHelperText>
            </FormControl>
          )}
        />

        <FormControl>
          <FormControlLabel
            required
            control={<Checkbox />}
            label={
              <Typography display="inline">
                I accept the <Link>Terms and Conditions</Link>
              </Typography>
            }
          />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          sx={{ backgroundColor: '#0359f7ff', color: '#ffffff', height: 36 }}
        >
          {login.isPending ? <CircularProgress size="1rem" color="inherit" /> : 'Log in'}
        </Button>
      </Box>
    </Card>
  );
};
