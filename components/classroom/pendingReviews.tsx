import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { User } from "../../models";
import { GetAllPendingReviewsService } from "../../services/pending-review";

function PendingReviews() {
  const { ref, inView } = useInView();

  const pendingReview = useInfiniteQuery({
    queryKey: ["pending-reviews"],
    queryFn: ({ pageParam }) =>
      GetAllPendingReviewsService({
        nextId: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.cursor === null) {
        return undefined;
      } else {
        return lastPage.cursor;
      }
    },
    initialPageParam: "",
  });

  useEffect(() => {
    if (inView) {
      pendingReview.fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex w-full flex-col items-center justify-start gap-3 font-Kanit">
      <h1 className="text-3xl font-semibold">งานรอตรวจทั้งหมด</h1>
      {pendingReview?.data?.pages.length === 0 && (
        <div className="h-max w-max rounded-md bg-white p-3 text-2xl">
          ไม่มีผู้เรียนให้ตรวจงาน 😃
        </div>
      )}
      <table className="flex  w-max flex-col gap-2 rounded-md bg-white p-10 px-0 pt-0">
        <thead>
          <tr className="sticky top-0 flex h-14 w-full  gap-4 bg-white px-10 py-5 drop-shadow-md">
            <th className="w-40">ชื่องาน</th>
            <th className="w-40">กำหนดส่ง</th>
            <th className="w-20">คะแนนเต็ม</th>
            <th className="w-20">เลขที่</th>
            <th className="w-60">ชื่อนักเรียน</th>
            <th className="w-24">สถานนะ</th>
          </tr>
        </thead>
        <tbody className="relative">
          {pendingReview.isFetchingNextPage && (
            <div
              className="absolute bottom-0 left-0 right-0 top-0 z-20 m-auto flex h-full
   w-full animate-pulse items-center justify-center rounded-lg bg-slate-200"
            >
              <div className="h-14 w-14 animate-spin rounded-full border-8 border-gray-300 border-t-blue-600" />
            </div>
          )}
          {pendingReview.isLoading ? (
            <div className="flex w-full flex-col gap-5">
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
              <Skeleton variant="rectangular" width="100%" height={50} />
            </div>
          ) : (
            pendingReview?.data?.pages?.map((lists) => {
              return lists?.pendingReview?.map((list, index) => {
                const date = new Date(list?.assignment?.deadline);
                const deadline = date.toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <Link
                    ref={
                      lists?.pendingReview.length === index + 1
                        ? ref
                        : undefined
                    }
                    target="_blank"
                    href={`/classroom/teacher/${list?.classroom?.id}/assignment/${list?.assignment?.id}`}
                    className="flex cursor-pointer gap-4 border-b-2 border-stone-100 bg-white px-1
                     py-2 text-black no-underline transition
                     duration-75 hover:scale-105 hover:bg-blue-50"
                    key={list?.student?.id}
                  >
                    <td className="w-40 text-center">
                      {list?.assignment?.title}
                    </td>
                    <td className="h-max w-40 rounded-md bg-red-500 p-1 text-center text-white">
                      {deadline}
                    </td>
                    <td className="w-20 text-center">
                      {list?.assignment?.maxScore}
                    </td>
                    <td className="w-20 truncate text-center">
                      {list?.student?.number}
                    </td>
                    <td className="w-60 truncate text-center">
                      {list?.student?.firstName}
                    </td>
                    <td
                      className="flex w-24 items-center rounded-md bg-yellow-500 p-2 text-center font-semibold
                     text-white "
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
      <div>
        {pendingReview.isFetchingNextPage ? (
          "Loading more..."
        ) : pendingReview.hasNextPage ? (
          <button
            onClick={() => pendingReview.fetchNextPage()}
            className="rounded-md bg-white px-5 py-1
           text-black drop-shadow-lg transition duration-100
            hover:bg-green-300 active:scale-105"
          >
            Load More
          </button>
        ) : (
          "Nothing more to load"
        )}
      </div>
    </div>
  );
}

export default PendingReviews;
