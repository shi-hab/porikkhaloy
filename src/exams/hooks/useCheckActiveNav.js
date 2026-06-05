import { useLocation } from "react-router-dom";

export default function useCheckActiveNav() {
  const { pathname } = useLocation();

  const checkActiveNav = (nav) => {
    const pathArray = pathname.split("/").filter((item) => item !== "");
    const navArray = nav?.split("/").filter((item) => item !== "");

    // If nav is the root path
    if (nav === "/" && pathArray?.length === 0) return true;

    // Check if each part of the nav path matches the pathname parts
    if (navArray?.length !== pathArray?.length) return false;

    return navArray.every((segment, index) => segment === pathArray[index]);
  };

  return { checkActiveNav };
}