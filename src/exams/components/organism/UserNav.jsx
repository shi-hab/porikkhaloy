import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logout from "./../molecules/auth/Logout";
import { useState } from "react";


const UserNav = () => {
  const auth = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false); // Dropdown state

  // Function to close dropdown
  const closeDropdown = () => setOpen(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="h-8 w-8 !shadow-inner">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>
              {auth?.student?.profile_image ? (
                <img
                  className="h-full w-full object-cover"
                  src={auth?.student?.profile_image}
                  alt="user image"
                />
              ) : (
                <span className="font-semibold uppercase">
                  {auth?.student?.name.charAt(0)}
                </span>
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="relative w-10 h-10 rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback>
                  {auth?.student?.profile_image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={auth?.student?.profile_image}
                      alt="user image"
                    />
                  ) : (
                    <span>{auth?.student?.name.charAt(0)}</span>
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
            <div className="flex flex-col gap-2 text-base">
              <p className="text-base font-semibold leading-none capitalize text-muted-foreground">
                {auth?.student?.name}
              </p>
              <p className="text-sm leading-none text-muted-foreground">
                {auth?.student?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={closeDropdown}>
            <Link
              to="user/profile"
              className="flex items-center w-full h-full p-2 text-base"
            >
              প্রোফাইল
            </Link>
          </DropdownMenuItem>

          <div className="sm:hidden">
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="user/packages"
                className="flex items-center w-full h-full p-2 text-base"
              >
                তোমার ব্যাচসমূহ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="user/subscription"
                className="flex items-center w-full h-full p-2 text-base"
              >
                সাবস্ক্রিপশন
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="user/question-feedback"
                className="flex items-center w-full h-full p-2 text-base"
              >
                ডাউট সল্ভ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="user/mentor-feedback"
                className="flex items-center w-full h-full p-2 text-base"
              >
                পার্সোনাল মেন্টরিং
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="user/exam-history"
                className="flex items-center w-full h-full p-2 text-base"
              >
                এক্সাম হিস্ট্রি
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="user/book-mark"
                className="flex items-center w-full h-full p-2 text-base"
              >
                বুক মার্ক প্রশ্ন
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="/privacy-policy"
                className="flex items-center w-full h-full p-2 text-base"
              >
                Privacy Policy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeDropdown}>
              <Link
                to="/terms-and-conditions"
                className="flex items-center w-full h-full p-2 text-base"
              >
                Terms of Service
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="!text-base">
          <Logout />
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="!text-base flex justify-center">
          <DarkModeToggle />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
