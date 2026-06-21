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
import { Link, useNavigate } from "react-router-dom";
import Logout from "./../molecules/auth/Logout";
import { useState } from "react";

/**
 * UserNav
 *
 * Props:
 * - onMobileClick?: () => void
 *    Called when the avatar is clicked on mobile/tablet (< lg).
 *    Used by Navbar to open the right-side drawer instead of a dropdown.
 *    If not provided, mobile click falls back to opening the dropdown (old behavior).
 */
const UserNav = ({ onMobileClick }) => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Dropdown state (desktop only)

  const closeDropdown = () => setOpen(false);

  const avatarMarkup = (
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
            {auth?.student?.name?.charAt(0)}
          </span>
        )}
      </AvatarFallback>
    </Avatar>
  );

  const handleTriggerClick = (e) => {
    // On mobile/tablet, hijack the click: don't open the dropdown,
    // instead let the parent Navbar open its right-side drawer.
    if (onMobileClick && window.matchMedia("(max-width: 1023px)").matches) {
      e.preventDefault();
      e.stopPropagation();
      onMobileClick();
    }
    // On desktop (lg+), do nothing here — DropdownMenuTrigger opens normally.
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-8 h-8 rounded-full"
          onClick={handleTriggerClick}
        >
          {avatarMarkup}
        </Button>
      </DropdownMenuTrigger>

      {/* This dropdown content only ever opens on desktop now,
          since mobile clicks are intercepted above. */}
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
                    <span>{auth?.student?.name?.charAt(0)}</span>
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
              to="/user/profile"
              className="flex items-center w-full h-full p-2 text-base"
            >
              প্রোফাইল
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="!text-base">
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;