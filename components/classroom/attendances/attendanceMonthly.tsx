import useAttendanceData from "../../../pages/classroom/teacher/[classroomId]/attendance/index";

export function processAttendanceData(attendances) {
  const yearCounts = {};

  const statusTypeArray = [
    "absent",
    "holiday",
    "late",
    "present",
    "sick",
    "warn",
  ];

  const monthsArray = Array.from({ length: 12 }, () => 0);

  attendances?.data?.students.forEach((item, index) => {
    if (index + 1 !== 0) {
      item.data.forEach((attendance) => {
        const year = new Date(attendance.date).getFullYear();
        const month = new Date(attendance.date).getMonth();

        yearCounts[year] = yearCounts[year] || { count: 0, statuses: {} };
        yearCounts[year].count += 1;

        statusTypeArray.forEach((status) => {
          yearCounts[year].statuses[status] = yearCounts[year].statuses[
            status
          ] || { statCount: 0, months: monthsArray.slice() };
          yearCounts[year].statuses[status].statCount += attendance[status]
            ? 1
            : 0;

          if (attendance[status]) {
            yearCounts[year].statuses[status].months[month]++;
          }
        });
      });
    }
  });

  const yearList = Object.entries(yearCounts).map(([year, data]) => ({
    year: parseInt(year),
    count: data.count,
    statuses: data.statuses,
  }));

  return yearList;
}

//yearList [{...},{...}]
//[{
//   year: 2023,
//   count: 8,
//   statuses: {
//     absent: {
//       statCount: 1,
//       months: [1,0,0,0,0,0,0,0,0,0,0,0,0] },
//     holiday: {
//       statCount: 1,
//       months: [1,0,0,0,0,0,0,0,0,0,0,0,0] },
//     present: {
//       statCount: 1,
//       months: [1,0,0,0,0,0,0,0,0,0,0,0,0] },
//       absent: {
//         statCount: 1,
//         months: [1,0,0,0,0,0,0,0,0,0,0,0,0] },
//     sick: {
//       statCount: 1,
//       months: [1,0,0,0,0,0,0,0,0,0,0,0,0] },
//     warn: {
//       statCount: 1,
//       months: [1,0,0,0,0,0,0,0,0,0,0,0,0] },
//   }
// }]
