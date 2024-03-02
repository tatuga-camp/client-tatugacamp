import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSettings } from "react-icons/fi";
import { Box, Skeleton, TextField } from "@mui/material";
import { MdDelete, MdOutlineAssignmentReturn } from "react-icons/md";
import Swal from "sweetalert2";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import { useRouter } from "next/router";
import Head from "next/head.js";
import { parseCookies } from "nookies";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link.js";
import { BsFileEarmark, BsFileEarmarkCode, BsImageFill } from "react-icons/bs";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { FcVideoFile } from "react-icons/fc";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  DeleteAssignmentService,
  GetAllAssignmentsService,
  GetAssignmentService,
  ViewAllAssignOnStudentService,
} from "../../../../../../services/assignment";
import { FileOnAssignment, User } from "../../../../../../models";
import ShowSelectFile from "../../../../../../components/assignment/showSelectFile";
import UpdateAssignment from "../../../../../../components/form/updateAssignment";
import AssignMultipleClassroom from "../../../../../../components/form/assignMultipleClassroom";
import Loading from "../../../../../../components/loadings/loading";
import ReviewAssignment from "../../../../../../components/classroom/assignment/reviewAssignment";
import { GetUserCookieService } from "../../../../../../services/user";

function Index({ user }: { user: User }) {
  const router = useRouter();
  const [loadingTiny, setLoadingTiny] = useState(true);
  const [triggerUpdateAssignment, setTriggerUpdateAssignment] = useState(false);
  const [triggerFullScreen, setTriggerFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerAssignMultipleClassroom, setTriggerAssignMultipleClassroom] =
    useState(false);
  const [triggerShowFile, setTriggerShowFile] = useState(false);
  const [selectFile, setSelectFile] = useState<FileOnAssignment>();
  const assignment = useQuery({
    queryKey: ["assignment", router.query.assignmentId],
    queryFn: () =>
      GetAssignmentService({
        assignmentId: router.query.assignmentId as string,
        classroomId: router.query.classroomId as string,
      }),
  });
  const assignments = useQuery({
    queryKey: ["assignments", router.query.classroomId],
    queryFn: () =>
      GetAllAssignmentsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const studentOnAssignments = useQuery({
    queryKey: ["studentOnAssignments", router.query.assignmentId],
    queryFn: () =>
      ViewAllAssignOnStudentService({
        assignmentId: router.query.assignmentId as string,
        classroomId: router.query.classroomId as string,
      }),
  });
  const [activeMenu, setActiveMenu] = useState(0);

  const menus = [
    {
      titleThai: "งาน",
      titleEnglish: "assignment",
    },
    {
      titleThai: "ตรวจงาน",
      titleEnglish: "check assignment",
    },
  ];

  useEffect(() => {
    initLightboxJS(
      process.env.NEXT_PUBLIC_LIGHTBOX_KEY as string,
      "individual"
    );
  }, []);

  // refetch studentOnAssinment when  there is new assignment?.data?.data?

  // convert date format
  const date = new Date(assignment?.data?.deadline as string);
  const formattedDate = date.toLocaleDateString(
    `${
      user?.language === "Thai"
        ? "th-TH"
        : user?.language === "English" && "en-US"
    }`,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  //handle to assign current assignment to another classroom
  const handleClickAssignMultipleClassroom = () => {
    setTriggerAssignMultipleClassroom((prev) => !prev);
  };

  //handle show update assignmnet compponent
  const handleClickUpdateAssignment = () => {
    studentOnAssignments.refetch();
    setTriggerAssignMultipleClassroom(() => false);
    setTriggerUpdateAssignment(true);
  };

  //handle click to delete assignment
  const handleDeleteAssignment = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(() => true);
          const deleteAssignment = await DeleteAssignmentService({
            assignmentId: assignment?.data?.id as string,
          });
          await assignments.refetch();
          Swal.fire("Deleted!", "Successfully Deleted Assignment", "success");
          router.push({
            pathname: `/classroom/teacher/${router.query.classroomId}/assignment`,
          });

          setIsLoading(() => false);
        } catch (err: any) {
          setIsLoading(() => false);
          console.error(err);
          Swal.fire("Error!", err?.message?.toString(), "error");
        }
      }
    });
  };

  //handle trigger menu
  const handleMenuTrigger = (index: number) => {
    if (index === 0) {
      setTriggerAssignMultipleClassroom(() => false);
    }
    if (index === 1) {
      studentOnAssignments.refetch();
    }
    setActiveMenu(index);
  };
  const handleSelectFile = ({ file }: { file: FileOnAssignment }) => {
    document.body.style.overflow = "hidden";
    setSelectFile(() => file);
    setTriggerShowFile(() => true);
  };

  return (
    <div className="bg-white w-full font-Kanit relative">
      {triggerShowFile && selectFile && (
        <ShowSelectFile
          setTriggerShowFile={setTriggerShowFile}
          file={selectFile}
        />
      )}
      <Head>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
        <title>assignment - {assignment?.data?.title}</title>
      </Head>
      {triggerUpdateAssignment ? (
        <UpdateAssignment
          user={user}
          assignment={assignment}
          setTriggerUpdateAssignment={setTriggerUpdateAssignment}
          studentOnAssignments={studentOnAssignments}
        />
      ) : (
        <div className="h-full ">
          {/* menu bars */}

          <div
            className={` w-full h-20  drop-shadow-md bg-white z-10 ${
              triggerFullScreen ? "hidden" : "flex"
            }  sticky top-0  justify-center gap-9`}
          >
            <Link
              href={`/classroom/teacher/${router.query.classroomId}/assignment/`}
              className="font-Poppins z-20 hover:scale-110 transition 
              duration-150 no-underline absolute top-3 left-2 text-white bg-blue-500 px-5 py-3 rounded-xl "
            >
              {user.language === "Thai" && "กลับ"}
              {user.language === "English" && "back"}
            </Link>
            {menus.map((menu, index) => {
              return (
                <div
                  onClick={() => handleMenuTrigger(index)}
                  key={index}
                  className=" hover:font-bold w-max hover:cursor-pointer text-xl font-Kanit 
                font-normal flex items-center  group justify-center underLineHover transition duration-150"
                >
                  <span
                    className={`text-[#2C7CD1] ${
                      activeMenu === index ? "font-bold" : "font-normal"
                    }`}
                  >
                    {user.language === "Thai" && menu.titleThai}
                    {user.language === "English" && menu.titleEnglish}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center w-full h-full ">
            {/* assignment detail */}
            {activeMenu === 0 && (
              <div className="w-full flex flex-col mt-5 items-center justify-start h-full  ">
                {triggerAssignMultipleClassroom ? (
                  <AssignMultipleClassroom
                    user={user}
                    setTriggerAssignMultipleClassroom={
                      setTriggerAssignMultipleClassroom
                    }
                  />
                ) : (
                  <div className="w-11/12   max-h-full">
                    <div className="flex justify-between ">
                      <span className="lg:text-4xl">
                        {assignment.isLoading || assignment.isFetching ? (
                          <Skeleton variant="text" width={200} />
                        ) : (
                          assignment?.data?.title
                        )}
                      </span>
                      <div className="flex items-center justify-center flex-col">
                        <div
                          className="w-max px-2 h-10 rounded-xl flex items-center justify-center
              bg-orange-400 font-Poppins font-bold text-xl text-white"
                        >
                          {assignment.isLoading || assignment.isFetching ? (
                            <Skeleton variant="text" />
                          ) : (
                            assignment?.data?.maxScore.toLocaleString()
                          )}
                        </div>
                        <span>
                          {user.language === "Thai" && "คะแนนเต็ม"}
                          {user.language === "English" && "score"}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-[2px] bg-blue-900 rounded-full"></div>
                    <div
                      className="mt-5 gap-2 font-Kanit text-xl w-full max-w-screen-2xl 
                   max-h-full overflow-y-hidden  overflow-x-auto flex items-start justify-center"
                    >
                      {(assignment.isLoading ||
                        assignment.isFetching ||
                        loadingTiny) && (
                        <div>
                          <Skeleton variant="text" width={300} height={400} />
                        </div>
                      )}
                      <div
                        className={` ${
                          assignment.isLoading ||
                          assignment.isFetching ||
                          loadingTiny
                            ? "w-0 h-0 opacity-0"
                            : "w-10/12 h-96 opacity-100"
                        }`}
                      >
                        <Editor
                          disabled={true}
                          apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                          init={{
                            setup: function (editor) {
                              editor.on("init", function () {
                                setLoadingTiny(() => false);
                              });
                            },
                            height: "100%",
                            width: "100%",
                            menubar: false,
                            toolbar: false,
                          }}
                          initialValue={assignment?.data?.description}
                          value={assignment?.data?.description}
                        />
                      </div>
                      <div className="w-5/12 h-full ">
                        <div className="text-xl flex items-center gap-2">
                          <span>ไฟล์แนบ</span>
                          <BsFileEarmark />
                        </div>
                        <ul className="w-full h-max max-h-[20rem] grid p-5 gap-5 overflow-auto ">
                          {assignment?.data?.files.map((file, index) => {
                            if (
                              file.type === "image/jpeg" ||
                              file.type === "" ||
                              file.type === "image/png"
                            ) {
                              return (
                                <div
                                  onClick={() =>
                                    handleSelectFile({ file: file })
                                  }
                                  key={index}
                                  className="w-full  select-none relative flex justify-start px-5 drop-shadow-sm 
                                  cursor-pointer  items-center gap-2 h-10 bg-sky-100 hover:scale-105 transition duration-75
                                 ring-2 ring-sky-500 rounded-xl"
                                >
                                  <div className="flex items-center justify-center text-sky-700">
                                    <BsImageFill />
                                  </div>
                                  <span className="w-max max-w-[20rem] truncate text-sm ">
                                    {file.name}
                                  </span>
                                </div>
                              );
                            } else if (
                              file.type === "video/mp4" ||
                              file.type === "video/quicktime"
                            ) {
                              return (
                                <div
                                  onClick={() =>
                                    handleSelectFile({ file: file })
                                  }
                                  key={index}
                                  className="w-full select-none relative flex justify-start px-5
                                  drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-red-100 
                                  hover:scale-105 transition duration-75
                               ring-2 ring-red-500 rounded-xl"
                                >
                                  <div className="flex items-center justify-center text-red-700">
                                    <FcVideoFile />
                                  </div>
                                  <span className="w-max max-w-[20rem] truncate text-sm ">
                                    {file.name}
                                  </span>
                                </div>
                              );
                            } else if (
                              file.type === "audio/mpeg" ||
                              file.type === "audio/mp3"
                            ) {
                              return (
                                <div
                                  onClick={() =>
                                    handleSelectFile({ file: file })
                                  }
                                  key={index}
                                  className="w-full select-none relative flex justify-start px-5
                                drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-pink-100 
                                hover:scale-105 transition duration-75
                             ring-2 ring-pink-500 rounded-xl"
                                >
                                  <div className="flex items-center justify-center text-pink-700">
                                    <FaFileAudio />
                                  </div>
                                  <span className="w-max max-w-[20rem] truncate text-sm ">
                                    {file.name}
                                  </span>
                                </div>
                              );
                            } else if (file.type === "application/pdf") {
                              return (
                                <div
                                  onClick={() =>
                                    handleSelectFile({ file: file })
                                  }
                                  key={index}
                                  className="w-full select-none relative flex justify-start px-5 
                                  drop-shadow-sm cursor-pointer  
                                  items-center gap-2 h-10 bg-sky-100 hover:scale-105 transition duration-75
                                 ring-2 ring-green-500 rounded-xl"
                                >
                                  <div className="flex items-center justify-center text-green-700">
                                    <FaRegFilePdf />
                                  </div>
                                  <span className="w-max max-w-[20rem] truncate text-sm ">
                                    {file.name}
                                  </span>
                                </div>
                              );
                            } else if (
                              file.type ===
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ) {
                              return (
                                <div
                                  onClick={() =>
                                    handleSelectFile({ file: file })
                                  }
                                  key={index}
                                  className="w-full  select-none relative flex justify-start px-5
                              drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-blue-100 
                              hover:scale-105 transition duration-75
                           ring-2 ring-blue-500 rounded-xl"
                                >
                                  <div className="flex items-center justify-center text-blue-700">
                                    <IoDocumentText />
                                  </div>
                                  <span className="w-max max-w-[20rem] truncate text-sm ">
                                    {file.name}
                                  </span>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  onClick={() =>
                                    handleSelectFile({ file: file })
                                  }
                                  key={index}
                                  className="w-full select-none relative flex justify-start px-5
                              drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-purple-100 
                              hover:scale-105 transition duration-75
                           ring-2 ring-purple-500 rounded-xl"
                                >
                                  <div className="flex items-center justify-center text-purple-700">
                                    <BsFileEarmarkCode />
                                  </div>
                                  <span className="w-max max-w-[20rem] truncate text-sm ">
                                    {file.name}
                                  </span>
                                </div>
                              );
                            }
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <div className="w-full  gap-2 mt-8 bg-blue-500 fixed bottom-0 ">
                  <div className="p-6 flex  items-end justify-between text-white">
                    <div>
                      <span>
                        {user.language === "Thai" && "กำหนดส่ง"}
                        {user.language === "English" && "due by"}
                      </span>
                      <span className="text-xl ml-2 font-semibold text-white hover:text-red-500">
                        {formattedDate}
                      </span>
                    </div>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <div className="flex gap-6">
                        <button
                          onClick={handleDeleteAssignment}
                          className="text-xl text-white hover:text-red-600 flex items-center justify-center flex-col hover:scale-110 
                  transition duration-150 ease-in-out cursor-pointer"
                        >
                          <MdDelete />
                          <span className="text-sm">
                            {user.language === "Thai" && "ลบงาน"}
                            {user.language === "English" && "delete assignment"}
                          </span>
                        </button>
                        <div
                          onClick={handleClickUpdateAssignment}
                          className="text-xl flex flex-col items-center justify-center hover:scale-110 transition duration-150 cursor-pointer
            "
                        >
                          <FiSettings />
                          <span className="text-sm">
                            {user.language === "Thai" && "แก้ไข"}
                            {user.language === "English" && "setting"}
                          </span>
                        </div>
                        <div
                          onClick={handleClickAssignMultipleClassroom}
                          className={`text-xl flex flex-col items-center ${
                            triggerAssignMultipleClassroom
                              ? "ring-white"
                              : "ring-transparent"
                          } ring-2  p-2 rounded-md 
                        justify-center active:ring-4 hover:scale-110 transition duration-150 cursor-pointer`}
                        >
                          <MdOutlineAssignmentReturn />
                          <span className="text-sm">
                            {user.language === "Thai" && "มอบหมายหลายห้อง"}
                            {user.language === "English" &&
                              "Assign to another classroom"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* student's assignment */}
            {activeMenu === 1 && (
              <ReviewAssignment
                assignment={assignment}
                triggerFullScreen={triggerFullScreen}
                setTriggerFullScreen={setTriggerFullScreen}
                user={user}
                studentOnAssignments={studentOnAssignments}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  if (accessToken) {
    try {
      const user = await GetUserCookieService({
        access_token: accessToken,
      });
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signIn",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signIn",
      },
    };
  }
};
