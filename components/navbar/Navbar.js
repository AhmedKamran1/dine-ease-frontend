import React from 'react';
import Link from 'next/link';

// Components
import Logo from '../logo/logo';
import NavbarDrawer from './drawer/drawer';
import ProfileMenu from './profile-menu/menu';
import NotificationMenu from './notification-menu/menu';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import InfoIcon from '@mui/icons-material/Info';

// Styles
import { Text } from '../UI';
import * as Styles from './navbar.styles';

const Navbar = () => {
  const navLinks = [
    { id: 'Home', link: '/', icon: <HomeIcon color="primary" /> },
    { id: 'Discover', link: '/', icon: <TravelExploreIcon color="primary" /> },
    { id: 'About Us', link: '/', icon: <InfoIcon color="primary" /> },
    { id: 'Log In', link: '/login', authItem: true },
    {
      id: 'Sign Up',
      link: '/signup',
      authItem: true,
      fill: true,
    },
  ];

  return (
    <Styles.AppBarContainer>
      <Logo />
      <Styles.NavContainer>
        {navLinks.map((item) => (
          <Link key={item.id} href={item.link}>
            {item.authItem ? (
              <Styles.AuthLink fill={item.fill ? 1 : 0}>
                <Text variant="body">{item.id}</Text>
              </Styles.AuthLink>
            ) : (
              <Styles.LinkContainer>
                <Text variant="body">{item.id}</Text>
              </Styles.LinkContainer>
            )}
          </Link>
        ))}
        <NotificationMenu />
        <ProfileMenu />
      </Styles.NavContainer>
      <NavbarDrawer navLinks={navLinks} />
    </Styles.AppBarContainer>
  );
};

export default Navbar;
