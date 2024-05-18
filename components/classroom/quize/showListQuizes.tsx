import React, { useState } from "react";
import { ErrorMessages, User } from "../../../models";
import { IoCreate, IoDuplicate, IoTime } from "react-icons/io5";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/router";
import CreateQuiz from "../../form/createQuiz";
import { useQuery } from "@tanstack/react-query";
import {
  DeleteExaminationService,
  GetExaminationsService,
} from "../../../services/examination";
import { FaRankingStar } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

type ShowListQuizesProps = {
  user: User;
};
function ShowListQuizes({ user }: ShowListQuizesProps) {
  const router = useRouter();
  const [triggerCreate, setTriggerCreate] = useState<boolean>(false);
  const quizs = useQuery({
    queryKey: ["quizs", router.query.classroomId],
    queryFn: () =>
      GetExaminationsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const handleDeleteExamination = async ({
    examinationId,
  }: {
    examinationId: string;
  }) => {
    let content = document.createElement("div");
    const replacedText = "ยืนยัน".replace(/ /g, "_");
    content.innerHTML =
      "<div>กรุณาพิมพ์ข้อความนี้</div> <strong>" +
      replacedText +
      "</strong> <div>เพื่อลบชิ้นงาน</div>";
    const { value } = await Swal.fire({
      title: "ยืนยันการแบบทดสอบ",
      input: "text",
      html: content,
      footer: "<strong>หากลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้</strong>",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== replacedText) {
          return "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง";
        }
      },
    });
    if (value) {
      try {
        Swal.fire({
          title: "กำลังลบแบบทดสอบ",
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
        await DeleteExaminationService({
          examinationId,
        });
        await quizs.refetch();
        Swal.fire({
          title: "ลบแบบทดสอบสำเร็จ",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        let result = error as ErrorMessages;
        Swal.fire({
          title: `${result.error ? result.error : "เกิดข้อผิดพลาด"}`,
          text: result.message.toString(),
          footer:
            result.statusCode &&
            "รหัสข้อผิดพลาด: " + result.statusCode?.toString(),
          icon: "error",
        });
      }
    }
  };
  return (
    <div className="mt-20 flex w-full flex-col items-center justify-start font-Kanit">
      {triggerCreate && <CreateQuiz setTriggerCreateProps={setTriggerCreate} />}
      <button
        onClick={() => setTriggerCreate(() => true)}
        className="mb-5 flex w-96 items-center justify-center gap-2 rounded-lg
         bg-white py-3 font-Kanit font-semibold text-main-color no-underline ring-1 
         ring-main-color drop-shadow-lg transition hover:bg-main-color hover:text-white active:scale-105"
      >
        <CiCirclePlus />
        สร้างแบบทดสอบ
      </button>
      <ul className="flex w-full flex-col items-center gap-5">
        {quizs.isLoading
          ? [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex h-40 w-5/12 animate-pulse flex-col gap-2 rounded-lg bg-gray-200 p-5 "
              ></div>
            ))
          : quizs.data?.map((quiz, index) => {
              return (
                <li
                  key={quiz.id}
                  className="flex h-max w-5/12 flex-col gap-2 rounded-lg bg-white p-5 drop-shadow-lg"
                >
                  <section className="flex w-full justify-between">
                    <div className="flex items-center justify-center gap-2 font-Kanit text-lg font-semibold text-main-color">
                      <div className="flex items-center justify-center gap-2">
                        <FaRankingStar />
                        {quiz.score?.toLocaleString() ?? 0} คะแนน
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <IoTime />
                        {quiz.duration?.toLocaleString() ?? 0} นาที /{" "}
                        {quiz.limitAttemps} ครั้ง
                      </div>
                    </div>
                    <div className="flex  items-center justify-center gap-2 font-Kanit font-semibold text-main-color">
                      <button
                        className="flex  items-center   justify-center gap-2 text-2xl
                     text-blue-500 transition duration-100 hover:text-blue-700 active:scale-105"
                      >
                        <IoDuplicate />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteExamination({
                            examinationId: quiz.id,
                          })
                        }
                        className="flex  items-center justify-center gap-2 text-2xl text-red-500 transition duration-100
                     hover:text-red-700 active:scale-105"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </section>
                  <section className="flex w-full flex-col gap-1">
                    <div className="max-w-full truncate font-Kanit text-3xl font-semibold text-main-color">
                      {quiz.title}
                    </div>
                    <div className="line-clamp-2 max-w-full break-words font-Kanit text-lg font-normal text-main-color">
                      {quiz.description}
                    </div>
                  </section>
                  <section className="flex  gap-2">
                    <Link
                      href={`/classroom/teacher/${router.query.classroomId}/quiz/${quiz.id}`}
                      className="flex items-center justify-center gap-2 rounded-md bg-main-color px-5 py-1 text-lg text-white no-underline ring-black transition
                   duration-100 hover:scale-105 active:scale-110 active:ring-1"
                    >
                      แก้ไข <CiEdit />
                    </Link>
                    <button
                      className="flex items-center justify-center gap-2 rounded-md bg-orange-400 px-5 py-1 text-lg text-white ring-black transition
                  duration-100 hover:scale-105 active:scale-110 active:ring-1"
                    >
                      มอบหมายงาน
                    </button>
                  </section>
                </li>
              );
            })}
      </ul>
    </div>
  );
}

export default ShowListQuizes;
