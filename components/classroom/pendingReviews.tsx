import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { User } from "../../models";

function PendingReviews({ user }: { user: User }) {
  const { ref, inView } = useInView();
  const pendingReview = useInfiniteQuery(
    ["pending-reviews"],
    ({ pageParam }) => {
      return GetAllPendingReviews({
        nextId: pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    }
  );
  useEffect(() => {
    if (inView) {
      pendingReview.fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="w-full flex flex-col font-Kanit items-center justify-start gap-3">
      <h1 className="text-3xl font-semibold">งานรอตรวจทั้งหมด</h1>
      {pendingReview?.data?.length === 0 && (
        <div className="text-2xl w-max h-max p-3 bg-white rounded-md">
          ไม่มีผู้เรียนให้ตรวจงาน 😃
        </div>
      )}
      <table className="w-max  bg-white rounded-md p-10 pt-0 px-0 gap-2 flex flex-col">
        <thead>
          <tr className="w-full bg-white h-14 px-10 py-5  drop-shadow-md sticky top-0 flex gap-4">
            <th className="w-40">ชื่องาน</th>
            <th className="w-40">กำหนดส่ง</th>
            <th className="w-20">คะแนนเต็ม</th>
            <th className="w-20">เลขที่</th>
            <th className="w-60">ชื่อนักเรียน</th>
            <th className="w-24">สถานนะ</th>
          </tr>
        </thead>
        <tbody>
          {pendingReview.isLoading ? (
            <div className="w-full flex flex-col gap-5">
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
            </div>
          ) : (
            pendingReview?.data?.pages?.map((list) => {
              return list?.pendingReview?.map((list) => {
                const date = new Date(list?.assignment?.deadline);
                const deadline = date.toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <Link
                    target="_blank"
                    href={`/classroom/teacher/${list?.classroom?.id}/assignment/${list?.assignment?.id}`}
                    className="no-underline border-b-2 border-stone-100 hover:scale-105 transition duration-75 cursor-pointer
                     bg-white hover:bg-blue-50 px-1 py-2
                     flex gap-4 text-black"
                    key={list?.student?.id}
                  >
                    <td className="w-40 text-center">
                      {list?.assignment?.title}
                    </td>
                    <td className="w-40 h-max bg-red-500 text-white rounded-md p-1 text-center">
                      {deadline}
                    </td>
                    <td className="w-20 text-center">
                      {list?.assignment?.maxScore}
                    </td>
                    <td className="w-20 text-center truncate">
                      {list?.student?.number}
                    </td>
                    <td className="w-60 truncate text-center">
                      {list?.student?.firstName}
                    </td>
                    <td
                      className="w-24 text-center flex items-center rounded-md p-2 font-semibold text-white
                     bg-yellow-500 "
                    >
                      รอการตรวจ
                    </td>
                  </Link>
                );
              });
            })
          )}
        </tbody>
      </table>
      <button
        ref={ref}
        onClick={() => pendingReview.fetchNextPage()}
        disabled={
          !pendingReview.hasNextPage || pendingReview.isFetchingNextPage
        }
      >
        {pendingReview.isFetchingNextPage
          ? "Loading more..."
          : pendingReview.hasNextPage
          ? "Load Newer"
          : "Nothing more to load"}
      </button>
    </div>
  );
}

export default PendingReviews;
