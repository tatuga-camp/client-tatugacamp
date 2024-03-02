import { GrScorecard } from "react-icons/gr";
import { FiArrowLeftCircle } from "react-icons/fi";
import React from "react";
import { NextRouter } from "next/router";
import { MdAssignment, MdHomeWork } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { FaCalendarCheck } from "react-icons/fa";

export function SideMenusThai({ router }: { router: NextRouter }) {
  const sideMenusThai = [
    {
      title: "โรงเรียน",
      icon: MdHomeWork,
      url: `/classroom/teacher`,
    },
    {
      title: "ห้องเรียน",
      icon: GiTeacher,
      url: `/classroom/teacher/${router?.query?.classroomId}`,
    },
    {
      title: "มอบหมายงาน",
      icon: MdAssignment,
      url: `/classroom/teacher/${router?.query?.classroomId}/assignment`,
    },
    {
      title: "ข้อมูลการเข้าเรียน",
      icon: FaCalendarCheck,
      url: `/classroom/teacher/${router?.query?.classroomId}/attendance`,
    },
    {
      title: "คะแนนรวม",
      icon: GrScorecard,
      url: `/classroom/teacher/${router?.query?.classroomId}/scores`,
    },

    {
      title: "หน้าหลัก",
      icon: FiArrowLeftCircle,
      url: `/`,
    },
  ];
  return sideMenusThai;
}

export function sideMenusEnglish({ router }: { router: NextRouter }) {
  const sideMenusEnglish = [
    {
      title: "school",
      icon: MdHomeWork,
      url: `/classroom/teacher`,
    },
    {
      title: "classroom",
      icon: GiTeacher,
      url: `#`,
    },
    {
      title: "assignments",
      icon: MdAssignment,
      url: `/classroom/teacher/${router?.query?.classroomId}/assignment`,
    },
    {
      title: "attendances",
      icon: FaCalendarCheck,
      url: `/classroom/teacher/${router?.query?.classroomId}/attendance`,
    },
    {
      title: "scores",
      icon: GrScorecard,
      url: `/classroom/teacher/${router?.query?.classroomId}/scores`,
    },

    {
      title: "homepage",
      icon: FiArrowLeftCircle,
      url: `/`,
    },
  ];
  return sideMenusEnglish;
}
