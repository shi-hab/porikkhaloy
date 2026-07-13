import { Link } from "react-router-dom";

const Logo = () => {
    const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL;
    const logo = "https://app.porikkhaloy.com/public/images/id_432_1782277125.png";

    return (
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center gap-2 h-14">
          <Link to={homePageUrl}>
            {/* Light mode logo */}
            <img
              src={logo}
              alt="logo"
              className=" h-9  w-auto block dark:hidden"
            />
          </Link>
        </div>
      </div>
    );
};

export default Logo;