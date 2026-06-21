import { Link } from "react-router-dom";

const Logo = () => {
    const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL;

    return (
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center gap-2 h-14">
          <Link to={homePageUrl}>
            {/* Light mode logo */}
            <img
              src="/logo/logo-light.png"
              alt="logo"
              className=" h-9  w-auto block dark:hidden"
            />
            {/* Dark mode logo */}
            <img
              src="/logo/logo-dark.png"
              alt="logo"
              className="h-10 w-auto hidden dark:block"
            />
          </Link>
        </div>
      </div>
    );
};

export default Logo;