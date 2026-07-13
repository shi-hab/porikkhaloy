import Logout from "../molecules/auth/Logout";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLinks } from "../../components/molecules/ui/NavLinks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

const UserNav = () => {
  const auth = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const avatar = (
    <div className="w-8 h-8 rounded-full overflow-hidden shadow-inner cursor-pointer flex items-center justify-center bg-muted">
      {auth?.student?.profile_image ? (
        <img
          src={auth.student.profile_image}
          alt="user"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold uppercase">
          {auth?.student?.name?.charAt(0)}
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {avatar}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/user/profile">প্রোফাইল</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div onClick={() => setMobileOpen(true)}>
          {avatar}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-72">
            <div className="space-y-2 mt-8">

              <Link
                to="/user/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
              >
                প্রোফাইল
              </Link>

              {NavLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}

              <div className="pt-4 border-t">
                <Logout />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default UserNav;