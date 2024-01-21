import { FaSchool } from "react-icons/fa";
import { FiSettings, FiArrowLeftCircle } from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { MdSubscriptions } from "react-icons/md";

export type MenubarsMain = {
  title: string;
  icon: IconType;
  url: string;
}[];
export const sideMenusThai = [
  {
    title: "โรงเรียน",
    icon: FaSchool,
    url: "/classroom/teacher",
  },
  {
    title: "สมัครสมาชิก",
    icon: MdSubscriptions,
    url: "/classroom/subscriptions",
  },
  {
    title: "ตั้งค่า",
    icon: FiSettings,
    url: "/classroom/setting",
  },
  {
    title: "หน้าหลัก",
    icon: FiArrowLeftCircle,
    url: "/",
  },
];
export const sideMenusEnglish = [
  {
    title: "school",
    icon: FaSchool,
    url: "/classroom/teacher",
  },
  {
    title: "subscriptions",
    icon: MdSubscriptions,
    url: "/classroom/subscriptions",
  },
  {
    title: "setting",
    icon: FiSettings,
    url: "/classroom/setting",
  },
  {
    title: "homepage",
    icon: FiArrowLeftCircle,
    url: "/",
  },
];
