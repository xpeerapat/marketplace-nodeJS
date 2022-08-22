import * as React from 'react';
import {
  IconButton, MenuItem, Toolbar,
  AppBar, Avatar, Tooltip, Link, Menu, Box
}
  from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { nav } from './theme/AppBarTheme'
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';

import { useState, useEffect } from 'react'
import { getAxios } from '../utils/axios'
import { tokenExist } from '../utils/tokenHandler'

const ResponsiveAppBar = () => {

  const navigate = useNavigate()
  const [notif, setNotif] = useState([])
  const [inbox, setInbox] = useState([])
  const [myUser, setMyUser] = useState({ name: '' })
  const [anchorElUser, setAnchorElUser] = useState(null);
  const myEndpoint = "http://192.168.1.125:8080/setting"

  const Endpoint = "http://192.168.1.125:8080/notify"
  const inboxEndpoint = "http://192.168.1.125:8080/chat/"

  const getMyUser = async () => {
    if (!tokenExist()) return;
    const { data } = await getAxios(myEndpoint)
    setMyUser(data.user)
  }

  const getNotify = async () => {
    if (tokenExist()) {
      const { data } = await getAxios(Endpoint)
      setNotif(data.inbox)
      const { data: { inbox } } = await getAxios(inboxEndpoint)
      setInbox(inbox[0])
    }
  }

  useEffect(() => {
    getMyUser()
    getNotify()
  }, [])

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
    navigate(0)
  }

  return (
    <ThemeProvider theme={nav}>
      <Box>
        <AppBar
          sx={{
            position: 'fixed',
            borderBottom: 1,
            boxShadow: 'none',
            borderColor: "#393A3B",
          }}>

          <Toolbar sx={{ my: -0.20 }} >
            <Box sx={{ ml: -1, mr: 1 }}>
              <Link href='/marketplace'>
                <Avatar
                  alt="logo" src="/images/logo.jpg"
                  sx={{
                    bgcolor: '#3A3B3C',
                    width: 45, height: 45
                  }} />
              </Link>
            </Box>

            {/* search */}
            <Box  >
              <Tooltip title="Search">
                <Link href='/search'>
                  <Avatar sx={{
                    bgcolor: '#3A3B3C',
                    width: 45, height: 45
                  }}>
                    <SearchIcon sx={{ color: '#B0B3B8' }} />
                  </Avatar>
                </Link>
              </Tooltip>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} />

            {/* Menu */}
            {myUser.name === '' ? null :
              <Box sx={{ mx: -0.5 }}>
                <Tooltip title="Menu">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar sx={{
                      bgcolor: '#3A3B3C',
                      width: 45, height: 45
                    }}>
                      <AppsIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Link href="/setting" underline="none" color="inherit">
                    <MenuItem>My Account</MenuItem>
                  </Link>
                  <Link href={'/profile/' + myUser._id} underline="none" color="inherit">
                    <MenuItem>My Store</MenuItem>
                  </Link>
                  <Link href={inbox && "/chat/" + inbox.user} underline="none" color="inherit">
                    <MenuItem>Inbox</MenuItem>
                  </Link>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </Box>}

            {!myUser.name ? null :
              <Link href="/Notifications" underline="none" color="inherit">
                <Box sx={{ mx: -0.5 }}  >
                  <Tooltip title="Notifications">
                    <IconButton >
                      <Avatar sx={{
                        bgcolor: '#3A3B3C',
                        width: 45, height: 45
                      }}>
                        <NotificationsIcon />
                        {notif.length}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Link>}

            <Link href="/setting" underline="none" color="inherit">
              <Box sx={{ mr: -1 }}>
                <Tooltip title="Your Profile">
                  <IconButton >
                    <Avatar alt={myUser.name} src={myUser.avatar}
                      sx={{
                        bgcolor: '#3A3B3C',
                        width: 45, height: 45
                      }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Link>

          </Toolbar>
        </AppBar >
      </Box >
    </ThemeProvider >
  );
};
export default ResponsiveAppBar;
