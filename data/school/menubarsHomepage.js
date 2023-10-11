import { FiSettings, FiArrowLeftCircle } from 'react-icons/fi';
export const sideMenusThai = [
  {
    title: 'โรงเรียน',
    icon: '🏫',
    url: '/school/dashboard',
  },
  {
    title: 'ตั้งค่า',
    icon: <FiSettings />,
    url: '/school/dashboard/setting',
  },
  {
    title: 'หน้าหลัก',
    icon: <FiArrowLeftCircle />,
    url: '/school',
  },
];
export const sideMenusEnglish = [
  {
    title: 'school',
    icon: '🏫',
    url: '/school/dashboard',
  },
  {
    title: 'setting',
    icon: <FiSettings />,
    url: '/school/dashboard/setting',
  },
  {
    title: 'homepage',
    icon: <FiArrowLeftCircle />,
    url: '/school',
  },
];
