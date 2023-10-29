import { useContext, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useMutation } from "@/hooks/useMutation";
import { useToast, Avatar } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import ArrowDown from "../icons/ArrowDown";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";
import IconNotification from "../icons/Notification";
import IconProfile from "../icons/Profile";
import IconLogout from "../icons/Logout";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();

  const userData = useContext(UserContext);

  const handleLogout = async () => {
    const response = await mutate({
      url: "https://paace-f178cafcae7b.nevacloud.io/api/logout",
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    if (!response?.success) {
      toast({
        title: "Logout Gagal",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      Cookies.remove("user_token");
      router.push("/login");
    }
  };

  return (
    <div className="bg-black max-w-xl mx-auto">
      {/* <Menu /> */}
      <Navbar
        height="2rem"
        onMenuOpenChange={setIsMenuOpen}
        className="text-white"
      >
        <NavbarContent>
          <NavbarBrand>
            <Link href="/" className="font-bold text-inherit cursor-pointer">
              Notes
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <Dropdown className="justify-self-end">
            <DropdownTrigger>
              <div className="flex gap-1 items-center cursor-pointer">
                <Avatar
                  size="xs"
                  className="items-center"
                  name={userData?.name.charAt(0)}
                />
                <ArrowDown className="items-center" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="profile"
                color="default"
                onClick={() => router.push("/profile")}
                startContent={<IconProfile />}
              >
                My Profile
              </DropdownItem>
              <DropdownItem
                key="notif"
                color="default"
                onClick={() => router.push("/notifications")}
                startContent={<IconNotification />}
              >
                Notifications
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={handleLogout}
                startContent={<IconLogout />}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
