import { Link } from "react-router-dom";

const Logo = ({ dark = null }) => {
  const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL;
  const dark_logo = "https://app.porikkhaloy.com/public/images/id_432_1782277125.png";
  const light_logo = "https://app.porikkhaloy.com/public/images/id_449_1785954108.png";

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center gap-2 h-14">
        <Link to={homePageUrl}>
          {/* Light mode logo */}
          {dark ? (
            <img
              src={light_logo}
              alt="logo"
              className=" h-9  w-auto block dark:hidden"
            />
          ) : (
            <img
              src={dark_logo}
              alt="logo"
              className=" h-9  w-auto block dark:hidden"
            />
          )}
        </Link>
      </div>
    </div>
  );
};

export default Logo;