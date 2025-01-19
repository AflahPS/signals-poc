import { Container } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Auth, Home, TopBar } from './components';
import { userStore } from './store';

export const App = observer(() => {
  const { user } = userStore;

  return (
    <Container component="main">
      <TopBar />
      {user ? <Home /> : <Auth />}
    </Container>
  );
});
