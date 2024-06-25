import React, { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../../models";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
//Chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(ChartDataLabels);

import Chart from "chart.js/auto";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseGetAllAttendanceService } from "../../../services/attendance";
import { processAttendanceData } from "../../../utils/processAttendanceData";
Chart.register(CategoryScale);
type AttendanceStatus =
  | "present"
  | "absent"
  | "holiday"
  | "late"
  | "sick"
  | "warn";
const monthNamesEN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthNamesTH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];
const initialData = {
  labels: monthNamesEN,
  datasets: [
    {
      label: "",
      data: [],
      backgroundColor: "",
    },
  ],
};

type MonthlySummaryProps = {
  user: User;
  attendances: UseQueryResult<ResponseGetAllAttendanceService, Error>;
};

//Get attendance monthly logic

//chart==========================
const statusTypeArray = [
  "absent",
  "holiday",
  "late",
  "present",
  "sick",
  "warn",
];

const statusTypeArrayTH = ["ขาด", "ลา", "สาย", "มาเรียน", "ป่วย", "เฝ้าระวัง"];

const statusColor = [
  "rgba(209, 44, 44, 1.0)",
  "rgba(237, 186, 2, 1.0)",
  "rgba(245, 94, 0, 1.0)",
  "rgba(0, 180, 81, 1.0)",
  "rgba(18, 133, 255, 1.0)",
  "rgba(132, 10, 208, 1.0)",
];

const optionChart = {
  responsive: true,
  plugins: {
    title: {
      display: false,
      text: "",
    },
    datalabels: {
      color: "#ffffff",
    },
  },
};

function MonthlySummary({ user, attendances }: MonthlySummaryProps) {
  const [selectedYear, setSelectedYear] = useState<number>();
  const [yearList, setYearList] =
    useState<{ year: number; count: any; statuses: any }[]>();
  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
    updateChartData(selectedStatus, parseInt(event.target.value));
  };
  const [chartData, setChartData] = useState(initialData);
  const [selectedStatus, setSelectedStatus] =
    useState<AttendanceStatus>("present");
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedStatus(value as AttendanceStatus);
    if (!selectedYear) return;
    updateChartData(value as AttendanceStatus, selectedYear);
  };

  const updateChartData = (status: AttendanceStatus, year: number) => {
    const yearData = yearList?.find((data) => data.year === year);
    if (yearData) {
      const monthsArray = yearData.statuses[status].months;

      const newChartData = {
        ...initialData,
        datasets: [
          {
            ...initialData.datasets[0],
            label: status,
            data: monthsArray,
            backgroundColor: statusColor[statusTypeArray.indexOf(status)],
          },
        ],
      };
      setChartData(newChartData);
    }
  };

  useEffect(() => {
    if (!attendances.data || attendances.isLoading) return;
    const years = processAttendanceData(attendances.data);
    setYearList(years);
    setSelectedYear(years[0].year);
  }, [attendances.isLoading]);

  useEffect(() => {
    if (!yearList) return;
    updateChartData(selectedStatus, yearList[0]?.year);
  }, [yearList]);

  const getStatusLabel = () => {
    const index = statusTypeArray.findIndex(
      (status) => status === selectedStatus
    );
    return user.language === "Thai" ? statusTypeArrayTH[index] : selectedStatus;
  };

  return (
    <div className="w-[24rem] h-[30rem] md:w-[50rem] md:h-[30rem] lg:w-[60rem] lg:h-[40rem] xl:w-[70rem] xl:h-[50rem]  flex flex-col  items-center gap-3 md:gap-5 mt-5">
      <div className="flex flex-col md:flex-row gap-2 md:gap-5 font-Kanit font-semibold">
        <div className="border-solid border-2 border-black p-2 rounded-md">
          <label>
            {user.language === "Thai" && "กรุณาเลือกปี :"}
            {user.language === "English" && "Select year :"}
          </label>
          {/* เดี๋ยวมี value กับ onChange อีก */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="ml-3 text-slate-400"
          >
            {yearList?.map((yearData) => (
              <option key={yearData.year} value={yearData.year}>
                {yearData.year}
              </option>
            ))}
          </select>
        </div>
        <div className="border-solid border-2 border-black p-2 rounded-md">
          <label>
            {user.language === "Thai" && "กรุณาเลือกสถานะการเข้าเรียน :"}
            {user.language === "English" && "Select status"}
          </label>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="ml-3 text-slate-400"
          >
            {statusTypeArray.map((status, index) => (
              <option key={status} value={status}>
                {user.language === "Thai" ? statusTypeArrayTH[index] : status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className=" w-10/12 h-10/12 flex flex-col gap-3 mt-10">
        <h2 className="flex justify-center items-center font-Kanit font-semibold text-xl text-[#2C7CD1]">
          {getStatusLabel()}
        </h2>
        <Bar options={optionChart} data={chartData} />
      </div>
    </div>
  );
}

export default MonthlySummary;
