import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Card,
    IconButton,
} from "@material-tailwind/react";
import {
    CubeTransparentIcon,
    UserCircleIcon,
    CodeBracketSquareIcon,
    Square3Stack3DIcon,
    ChevronDownIcon,
    PowerIcon,
    RocketLaunchIcon,
    FolderIcon,
    FolderPlusIcon,
    Cog8ToothIcon

} from "@heroicons/react/24/solid";
import {signOutUser} from "../firebase/firebase";

function ProfileMenu() {
     const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const LogOut = async () => {
        try {
          await signOutUser();
            navigate("/");
            console.log("Log Out com sucesso")
        } catch (error) {
            console.error("Erro ao fazer log out:", error.message);
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
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""
                            }`}
                    />
                </Button>
            </MenuHandler>
            <MenuList >
                <PowerIcon onClick={LogOut} style={{ width: '25px', height: '25px', marginTop: "10px"}} />
            </MenuList>
        </Menu>
    );
}


// nav list component
const navListItems = [
    {
        label: "Forms",
        icon: FolderIcon,
    },
    {
        label: "Create Form",
        icon: FolderPlusIcon,
    },
    {
        label: "Settings",
        icon: Cog8ToothIcon,
    },
];

function NavList() {
    return (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            {navListItems.map(({ label, icon }, key) => (
                <Typography
                    key={label}
                    as="a"
                    href="#"
                    variant="small"
                    color="gray"
                    className="font-medium text-blue-gray-500"
                >
                    <MenuItem className="flex items-center gap-2 lg:rounded-full">
                        {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
                        <span className="text-gray-900"> {label}</span>
                    </MenuItem>
                </Typography>
            ))}
        </ul>
    );
}

export function ComplexNavbar() {
    const [isNavOpen, setIsNavOpen] = React.useState(false);

    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setIsNavOpen(false),
        );
    }, []);

    return (
        <Navbar className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
            <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
                <div className="hidden lg:block">
                    <NavList />
                </div>
                <IconButton
                    size="sm"
                    color="blue-gray"
                    variant="text"
                    onClick={toggleIsNavOpen}
                    className="ml-auto mr-2 lg:hidden"
                >

                </IconButton>
                <ProfileMenu />
            </div>
            <MobileNav open={isNavOpen} className="overflow-scroll">
                <NavList />
            </MobileNav>
        </Navbar>
    );
}

export default ComplexNavbar;