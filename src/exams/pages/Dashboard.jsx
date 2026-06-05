import { Menu } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import {
  MdHistory,
  MdOutlineAddCard,
  MdOutlineFeedback,
} from "react-icons/md";
import { CiBookmark } from "react-icons/ci";
import { LuPackage } from "react-icons/lu";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = () => {
    setCollapsed(true); // Collapse menu on item click
  };

  const items = [
    {
      key: "1",
      label: <Link to="profile">Dashboard</Link>,
      icon: <FaRegUserCircle />,
    },
    {
      key: "2",
      label: <Link to="exam-history">Exam History</Link>,
      icon: <MdHistory size={20} />,
    },
    {
      key: "3",
      label: <Link to="packages">Packages</Link>,
      icon: <LuPackage />,
    },
    {
      key: "4",
      label: <Link to="subscription">Subscription</Link>,
      icon: <MdOutlineAddCard />,
    },
    {
      key: "5",
      label: <Link to="question-feedback">Question Feedback</Link>,
      icon: <MdOutlineFeedback />,
    },
    {
      key: "6",
      label: <Link to="mentor-feedback">Personal Mentoring</Link>,
      icon: <MdOutlineFeedback />,
    },
    {
      key: "7",
      label: <Link to="book-mark">সেইভ প্রশ্ন</Link>,
      icon: <CiBookmark />,
    },
  ];

  return (
    <div>
      <div className="hidden md:block">
        <div
          className={`fixed flex z-20 top-[63px] sm:top-[54px] bottom-0 left-0`}
        >
          <Menu
            mode="inline"
            className="z-20 h-screen"
            defaultSelectedKeys={["1"]}
            style={{ width: collapsed ? 50 : 256 }}
            items={items}
            inlineCollapsed={collapsed}
            onClick={handleMenuClick} // Collapse menu when clicking any item
          />
          <Button
            type="primary"
            onClick={toggleCollapsed}
            className="rounded-none"
            style={{ marginBottom: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
