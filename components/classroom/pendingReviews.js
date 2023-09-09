import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { GetAllPendingReviews } from '../../service/pending-review';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@mui/material';

function PendingReviews({ user }) {
  const pendingReview = useQuery(['pending-reviews'], () =>
    GetAllPendingReviews(),
  );

  return (
    <ul className="w-full flex flex-col font-Kanit items-center justify-start gap-3">
      {pendingReview?.data?.length === 0 && (
        <div className="text-2xl w-max h-max p-3 bg-white rounded-md">
          ไม่มีผู้เรียนให้ตรวจงาน 😃
        </div>
      )}
      {pendingReview.isLoading ? (
        <Skeleton variant="rectangular" width={400} height={150} />
      ) : (
        pendingReview?.data?.map((list) => {
          return (
            <li
              key={list.classroom.id}
              className="w-full max-w-xl p-5 bg-white rounded-xl drop-shadow-md h-max"
            >
              <header className="border-b-2 border-gray-600 pb-3">
                <div>ห้องเรียน</div>
                <h2 className="text-xl font-semibold text-blue-800">
                  {list.classroom.title}
                </h2>
                <div className="text-lg flex gap-2">
                  <span>{list.classroom.level}</span>
                  <span>{list.classroom.description}</span>
                </div>
              </header>
              <ul className="w-full gap-5   mt-5 grid-cols-1 grid">
                {list.data.map((assignment, index) => {
                  const date = new Date(assignment.deadline);
                  const formattedDate = date.toLocaleDateString(
                    `${
                      user.language === 'Thai'
                        ? 'th-TH'
                        : user.language === 'English' && 'en-US'
                    }`,
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    },
                  );
                  return (
                    <li
                      className=" ml-5  p-5 ring-2 ring-blue-500 rounded-lg"
                      key={assignment.id}
                    >
                      <div className="font-semibold text-lg">
                        {assignment.title}
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <div className="p-1 rounded-md text-white bg-orange-600 w-max h-max">
                          คะแนนเต็ม {assignment.maxScore}
                        </div>
                        <div className="p-1 rounded-md text-white bg-red-600 w-max h-max">
                          กำหนดส่ง {formattedDate}
                        </div>
                      </div>
                      <ul className="grid mt-5 gap-5 place-items-center">
                        {assignment.students.map((student, index) => {
                          return (
                            <Link
                              href={`/classroom/teacher/${list.classroom.id}/assignment/${assignment.id}`}
                              className="w-full no-underline text-black hover:bg-slate-200 transition duration-100 items-center justify-between border-b-2 border-black  p-2 flex"
                              key={index}
                            >
                              <div className="w-max flex items-center gap-3">
                                <span>{student.number}</span>
                                <span>{student.firstName}</span>
                                <span>{student.lastName}</span>
                                <div className="w-10 h-10 ring-2 ring-black relative rounded-md overflow-hidden">
                                  <Image
                                    fill
                                    className="object-cover"
                                    src={student.picture}
                                  />
                                </div>
                              </div>
                              <Link
                                className="no-underline hover:scale-110 transition duration-150
                               w-max h-max bg-yellow-400 text-white font-semibold p-2"
                                href={`/classroom/teacher/${list.classroom.id}/assignment/${assignment.id}`}
                              >
                                <span>
                                  {user.language === 'Thai'
                                    ? 'รอตรวจ'
                                    : 'pending review'}
                                </span>
                              </Link>
                            </Link>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })
      )}
    </ul>
  );
}

export default PendingReviews;
