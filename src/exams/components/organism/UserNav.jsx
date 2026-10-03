import { ChevronRight, User as UserIcon } from "lucide-react";
import Logout from "../molecules/auth/Logout";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLinks } from "../../components/molecules/ui/NavLinks";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetBody,
} from "@/components/ui/sheet";

const UserNav = () => {
  const auth = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const name = auth?.student?.name;
  const studentId = auth?.student?.student_id ?? auth?.student?.id;
  const initial = name?.charAt(0)?.toUpperCase();

  const Avatar = ({ size = "size-9" }) => (
    <div
      className={`${size} rounded-full overflow-hidden ring-2 ring-transparent transition-all hover:ring-primary/30 cursor-pointer flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5`}
    >
      {auth?.student?.profile_image ? (
        <img
          src={auth.student.profile_image}
          alt={name || "user"}
          className="w-full h-full object-cover"
        />
      ) : initial ? (
        <span className="font-bold text-primary">{initial}</span>
      ) : (
        <UserIcon className="size-4 text-muted-foreground" />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-full">
        <div className="flex items-center gap-2">
          <Link
            to="/user/profile"
            onClick={() => setMobileOpen(false)}
            className="group flex flex-1 items-center gap-3 -m-1 p-1 rounded-lg transition-colors hover:bg-muted"
          >
            <Avatar size="size-10" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-regular truncate">
                {name || "প্রোফাইল"}
              </p>

              <p className="text-xs text-muted-foreground">
                আইডি : #000{studentId || ""}
              </p>
            </div>
          </Link>

          <Logout>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <LogOut className="size-4 text-destructive" />
            </Button>
          </Logout>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div onClick={() => setMobileOpen(true)}>
          <Avatar />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <Link
                to="/user/profile"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 -m-1 p-1 rounded-lg transition-colors hover:bg-muted"
              >
                <Avatar size="size-10" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-regular truncate">
                    {name || "প্রোফাইল"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    আইডি : #000{studentId || ""}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </SheetHeader>

            <SheetBody className="space-y-1">
              {NavLinks.map((item) => {
                const isActive = item.urlActive?.includes(location.pathname);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${isActive
                      ? "bg-primary/10 text-primary font-regular"
                      : "text-foreground hover:bg-muted"
                      }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
                    )}
                    <span
                      className={`transition-colors [&_svg]:size-4 ${isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                        }`}
                    >
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                );
              })}
            </SheetBody>

            <SheetFooter>
              <Logout>
                <Button
                  size="icon"
                  className="w-full"
                >
                  Logout
                </Button>
              </Logout>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default UserNav;