import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  FolderIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/solid";
import { signOutUser } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";

const navListItems = [
  {
    label: "Forms",
    icon: FolderIcon,
    url: "/home",
  },
  {
    label: "Create Form",
    icon: FolderPlusIcon,
    url: "/create-form",
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { updateAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      updateAuthUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-center">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <UserCircleIcon className="h-6 w-6" />
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={handleLogout}>
          <PowerIcon style={{ width: "25px", height: "25px", marginTop: "10px" }} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (url) => {
    navigate(url);
    setIsNavOpen(false);
  };

  return (
    <Navbar className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <div className="hidden lg:block">
          <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            {navListItems.map(({ label, icon: Icon, url }, key) => (
              <Typography
                key={label}
                variant="small"
                color="gray"
                className="font-medium text-blue-gray-500"
              >
                <MenuItem
                  onClick={() => handleItemClick(url)}
                  className="flex items-center gap-2 lg:rounded-full"
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-gray-900">{label}</span>
                </MenuItem>
              </Typography>
            ))}
          </ul>
        </div>
        <ProfileMenu />
      </div>
      <div className="lg:hidden">
        <Button
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="ml-auto mr-2"
        >
          Menu
        </Button>
      </div>
      {isNavOpen && (
        <div className="lg:hidden">
          <ul className="flex flex-col gap-2">
            {navListItems.map(({ label, icon: Icon, url }, key) => (
              <Typography
                key={label}
                variant="small"
                color="gray"
                className="font-medium text-blue-gray-500"
              >
                <MenuItem onClick={() => handleItemClick(url)}>
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-gray-900">{label}</span>
                </MenuItem>
              </Typography>
            ))}
          </ul>
        </div>
      )}
    </Navbar>
  );
}

export default ComplexNavbar;
