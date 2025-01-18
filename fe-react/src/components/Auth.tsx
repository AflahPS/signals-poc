import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '../store';
import { userPassword } from '../config/vars';
import { login, LoginResponse, register } from '../services';
import { ApiResponse } from '../models';
import { postLoginHandler } from '../utils/helpers';

export const Auth = observer(() => {
  const { setUser } = userStore;
  const [view, setView] = useState<'login' | 'register'>('login');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [helperText, setHelperText] = useState(' ');
  const [loading, setLoading] = useState<boolean>(false);

  const resetFields = () => {
    setName('');
    setEmail('');
    setHelperText(' ');
    setLoading(false);
  };

  const handleAuth = async () => {
    try {
      setLoading(true);
      let res: ApiResponse<LoginResponse>;

      if (view === 'register') {
        res = await register({
          email: email.trim(),
          password: userPassword,
          name: name.trim(),
        });
      } else {
        res = await login({
          email: email.trim(),
          password: userPassword,
        });
      }
      const { data, error, message } = res;

      if (!data && error) {
        setHelperText(
          `${capitalize(view)} failed, ${message?.toLowerCase() || 'please try again !'}`
        );
        setLoading(false);
        return;
      }
      setLoading(false);
      setUser(data?.user);
      postLoginHandler(data!);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Grid container component="main" width="lg" height="50vh">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          alignItems: 'center',
          rowGap: 2,
          textAlign: 'center',
          justifyContent: 'center',
          paddingX: '10vw',
        }}
      >
        <Box
          component="form"
          width={{ xs: '100%', md: '50%' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
        >
          <Stack width="100%" gap={2}>
            {view === 'register' && (
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Name"
                type="text"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                value={name}
                onChange={(e) => {
                  setHelperText(' ');
                  setName(e.target.value);
                }}
              />
            )}
            <TextField
              fullWidth
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              helperText={helperText}
              FormHelperTextProps={{ sx: { color: '#cd0000' } }}
              value={email}
              onChange={(e) => {
                setHelperText(' ');
                setEmail(e.target.value);
              }}
              InputProps={{
                endAdornment: loading && <CircularProgress size={24} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="small"
              fullWidth
              sx={{ borderRadius: '12px' }}
              disabled={loading}
            >
              <Typography
                sx={{ fontWeight: '500', textTransform: 'none' }}
                variant="subtitle1"
              >
                {view === 'login' ? 'LOGIN' : 'SIGN UP'}
              </Typography>
            </Button>

            <Button
              variant="text"
              size="small"
              sx={{ borderRadius: '12px' }}
              onClick={() => {
                resetFields();
                setView(view !== 'login' ? 'login' : 'register');
              }}
            >
              <Typography
                sx={{ fontWeight: '500', textTransform: 'none' }}
                variant="subtitle1"
              >
                {view !== 'login' ? 'LOGIN' : 'SIGN UP'}
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Container>
    </Grid>
  );
});
