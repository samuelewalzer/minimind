import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


export default function AppHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/profile">
            <button>My Profile</button>
          </Link>
          <Typography variant="h4" align="center" component="div" sx={{ flexGrow: 1 }}>
            minimind
          </Typography>
          <Link to="/mystats">
            <button>My Stats</button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
  }