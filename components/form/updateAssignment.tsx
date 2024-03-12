import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import { MdDelete, MdError, MdOutlineCancel } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { GrRevert, GrScorecard } from "react-icons/gr";
import { TiUserDelete } from "react-icons/ti";

import Swal from "sweetalert2";
import { Box, Skeleton, TextField } from "@mui/material";
import { loadingCount } from "../../data/loadingCount";
import { BsFileEarmarkCode, BsImageFill } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Student, StudentWithScore, StudentWork, User } from "../../models";
import { UseQueryResult } from "@tanstack/react-query";
import {
  AssignWorkToStudentService,
  CreateFileOnAssignmentService,
  DeleteFileOnAssignmentService,
  ResponseGetAssignmentService,
  ResponseViewAllAssignOnStudentService,
  UnAssignWorkStudentService,
  UpdateAssignmentService,
} from "../../services/assignment";
import { filePickerCallback } from "../../utils/filePickerCallback";
import Loading from "../loadings/loading";

const tabs = [
  {
    titleEnglish: "assignment",
    titleThai: "งาน",
  },
  {
    titleEnglish: "students",
    titleThai: "นักเรียน",
  },
];

type UpdateAssignmentProps = {
  user: User;
  assignment: UseQueryResult<ResponseGetAssignmentService, Error>;
  setTriggerUpdateAssignment: React.Dispatch<React.SetStateAction<boolean>>;
  studentOnAssignments: UseQueryResult<
    ResponseViewAllAssignOnStudentService,
    Error
  >;
};
function UpdateAssignment({
  assignment,
  setTriggerUpdateAssignment,
  studentOnAssignments,
  user,
}: UpdateAssignmentProps) {
  const rounter = useRouter();
  const [assignmentData, setAssignmentData] =
    useState<ResponseGetAssignmentService>(
      assignment?.data as ResponseGetAssignmentService
    );
  const [isChecked, setIsChecked] = useState<
    (StudentWithScore & {
      isAssign: boolean;
      status?: "no-assign";
    })[]
  >();
  const [isAssignStudent, setIsAssignmentStdent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActivetab] = useState(0);
  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [fileSize, setFilesSize] = useState<string>("0");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.prototype.slice.call(e.target.files);
    let totalSize = 0;

    // Combine the existing selected files with the newly selected files
    const updatedSelectedFiles = [...selectedFiles, ...newFiles];
    for (let i = 0; i < updatedSelectedFiles.length; i++) {
      totalSize += updatedSelectedFiles[i].size;
    }

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    setFilesSize(totalSizeInMB);

    setSelectedFiles(updatedSelectedFiles);
  };

  useEffect(() => {
    if (assignment?.data) {
      setAssignmentData(() => assignment?.data);
    }
  }, [assignment.data]);

  const handleRemoveFile = ({ file }: { file: File }) => {
    setSelectedFiles((prev) => {
      const filter = prev.filter(
        (list) => list.lastModified !== file.lastModified
      );
      return [...filter];
    });
  };

  const handleDeleteFileOnAssignment = ({
    fileOnAssignmentId,
  }: {
    fileOnAssignmentId: string;
  }) => {
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
          Swal.fire({
            title: "กำลังลบ...",
            html: "รอสักครู่นะครับ...",
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await DeleteFileOnAssignmentService({ fileOnAssignmentId });
          await assignment.refetch();
          Swal.fire("Deleted!", "", "success");
        } catch (err: any) {
          console.error(err);
          Swal.fire("Error!", err?.message?.toString(), "error");
        }
      }
    });
  };

  //handdle active tab
  const handleActiveTab = (index: number) => {
    setActivetab(index);

    if (index === 0) {
      setIsAssignmentStdent(false);
    } else if (index === 1) {
      setIsAssignmentStdent(true);
    }
  };

  // handle chagne of assignment's detail
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  //set isCheck to students
  useEffect(() => {
    setIsChecked(() =>
      studentOnAssignments?.data?.map((student) => {
        return {
          ...student,
          isAssign: false,
        } as StudentWithScore & {
          isAssign: boolean;
          status: "no-assign";
        };
      })
    );
  }, [studentOnAssignments?.data]);

  // when input checkobx change apply value to isChecked in each student
  const handleChangeCheck = ({ studentId }: { studentId: string }) => {
    setIsChecked((prevState) => {
      return prevState?.map((prevStudent) => {
        if (prevStudent.id === studentId) {
          return {
            ...prevStudent,
            isAssign: !prevStudent.isAssign,
          };
        } else {
          return { ...prevStudent };
        }
      });
    });
  };

  //convert the string date to format that input date required
  const date = new Date(assignmentData.deadline);
  const formattedDate = date.toISOString().split("T")[0];

  //handle click to sclect all student
  const onClickIsCheck = () => {
    setIsChecked((prevState) => {
      return prevState?.map((student) => {
        if (student.status === "no-assign") {
          return {
            ...student,
            isAssign: !student.isAssign,
          };
        } else {
          return {
            ...student,
          };
        }
      });
    });
  };

  //handle click to assign student work
  const onClickAssignWork = async () => {
    try {
      setLoading(true);
      if (!isChecked) throw new Error("no student to assign");
      const assign = await AssignWorkToStudentService({
        isChecked,
        assignmentCreated: assignmentData,
      });
      await studentOnAssignments.refetch();
      setIsChecked(assign);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formFiles = new FormData();
      selectedFiles.forEach((file) => {
        formFiles.append("files", file);
      });
      setLoading(() => true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        assignmentData?.description,
        "text/html"
      );
      const imageElements = doc.getElementsByTagName("img");

      const imageUrls = Array.from(imageElements)
        .map((img) => {
          const src = img.src;
          if (src.startsWith("data:image")) {
            // Check if the src attribute starts with "data:image" (base64 image)
            return src;
          } else {
            return null; // Skip images with actual URLs
          }
        })
        .filter(Boolean); // Filter out null values (i.e., actual URLs)

      await UpdateAssignmentService({
        assignmentId: assignmentData.id,
        title: assignmentData.title,
        description: assignmentData.description,
        maxScore: assignmentData.maxScore,
        deadline: assignmentData.deadline,
        imagesBase64: imageUrls as string[],
      });

      await CreateFileOnAssignmentService({
        formFiles: formFiles,
        assignmentId: assignmentData.id,
      });

      await assignment.refetch();
      Swal.fire("success", "assignment has been updated", "success");
      setLoading(() => false);
      setTriggerUpdateAssignment(false);
    } catch (err: any) {
      setLoading(() => false);
      console.error(err);
      Swal.fire("error", err?.message.toString(), "error");
    }
  };

  const handleUnDoAssignmentOnStudent = async ({
    studentId,
  }: {
    studentId: string;
  }) => {
    try {
      setLoadingItems((prev) => {
        return [...prev, studentId];
      });
      await UnAssignWorkStudentService({
        studentId: studentId,
        assignmentId: assignmentData.id,
      });
      await studentOnAssignments.refetch();
      setLoadingItems((prev) => {
        const filterOut = prev.filter(
          (oldstudentId) => oldstudentId !== studentId
        );
        return [...filterOut];
      });
    } catch (err) {
      setLoadingItems((prev) => {
        const filterOut = prev.filter(
          (oldstudentId) => oldstudentId !== studentId
        );
        return [...filterOut];
      });
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 relative  justify-center items-center bg-white  font-Kanit 
      "
    >
      <button
        onClick={() => setTriggerUpdateAssignment(false)}
        className="absolute gap-0 flex flex-col justify-center items-center z-20 
        top-5 right-5 text-lg hover:scale-110 hover:text-red-400 transition duration-150 cursor-pointer"
      >
        <div className="text-xl">
          <MdOutlineCancel />
        </div>
        ยกเลิก
      </button>
      <div className="w-full flex mt-5 items-center justify-center ">
        <div className="flex w-56  gap-5 h-10 justify-between bg-white  rounded-xl">
          {tabs.map((tab, index) => {
            return (
              <div
                key={index}
                role="button"
                onClick={() => handleActiveTab(index)}
                className={`w-28 px-4 select-none ring-2 appearance-none ring-black
                 flex items-center justify-center cursor-pointer h-full rounded-xl ${
                   activeTab === index
                     ? "text-white bg-orange-600"
                     : "text-black bg-transparent"
                 }`}
              >
                {user.language === "Thai" && tab.titleThai}
                {user.language === "English" && tab.titleEnglish}
              </div>
            );
          })}
        </div>
      </div>
      {isAssignStudent === false ? (
        <div className="w-full h-full flex flex-col justify-start items-center gap-8  ">
          <div className="flex-col flex gap-4 m-5 w-3/4">
            <div className="flex flex-col gap-0">
              <Box width="100%" className="bg-white">
                <TextField
                  name="title"
                  onChange={handleChange}
                  fullWidth
                  label="title"
                  value={assignmentData?.title}
                />
              </Box>
            </div>
            <div className="h-96">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                textareaName="description"
                value={assignmentData?.description}
                init={{
                  link_context_toolbar: true,
                  height: "100%",
                  width: "100%",
                  menubar: true,
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: "image",
                  file_picker_callback: filePickerCallback,
                  plugins: [
                    "contextmenu",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  contextmenu:
                    "paste | link image inserttable | cell row column deletetable",
                  toolbar:
                    "undo redo | formatselect | blocks | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help | link | image",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onEditorChange={(newText) =>
                  setAssignmentData((prev) => {
                    return {
                      ...prev,
                      description: newText,
                    };
                  })
                }
              />
            </div>
            <div className="w-full flex gap-5 flex-wrap justify-start items-end">
              <div className=" flex flex-col">
                <label>
                  {user.language === "Thai" && "กำหนดส่ง"}
                  {user.language === "English" && "due by"}
                </label>
                <input
                  value={formattedDate}
                  onChange={handleChange}
                  name="deadline"
                  className="w-max appearance-none outline-none border-none ring-2  rounded-md px-5 
            py-2 text-lg ring-gray-200 focus:ring-black "
                  type="date"
                  placeholder="Please select a date"
                  required
                />
              </div>
              <div className=" flex flex-col mt-0 relative ">
                <label>
                  {user.language === "Thai" && "คะแนนของงาน"}
                  {user.language === "English" && "score"}
                </label>
                <input
                  min="1"
                  value={assignmentData.maxScore}
                  required
                  step="0.01"
                  onChange={handleChange}
                  name="maxScore"
                  className="w-max appearance-none outline-none border-none ring-2 rounded-md px-5 
            py-2 text-lg ring-gray-200 focus:ring-black placeholder:text-sm"
                  type="number"
                />
                <div className="text-lg absolute top-8 right-5">
                  <GrScorecard />
                </div>
              </div>
              <label
                htmlFor="dropzone-file"
                className="w-max flex flex-col h-max gap-1 justify-center items-center"
              >
                <div
                  className="w-max cursor-pointer h-max hover:scale-105 transition duration-150
                   bg-white drop-shadow-xl ring-2 px-5 py-2  ring-black text-black text-2xl flex justify-center items-center rounded-2xl"
                >
                  <AiOutlineCloudUpload />
                  <span className="text-base">อัพโหลดไฟล์</span>
                </div>

                <input
                  id="dropzone-file"
                  onChange={handleFileEvent}
                  name="files"
                  aria-label="upload image"
                  type="file"
                  multiple={true}
                  accept="application/pdf,
                      image/jpeg,
                      image/png,
                      image/gif,
                      application/msword,
                      application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                      video/mp4,
                      audio/mpeg"
                  className="text-sm text-grey-500 hidden  ring-2 appearance-none
            file:mr-5 md:file:w-40 file:w-40 w-max file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-Kanit file:font-normal file:text-white
             bg-white rounded-full
            file:bg-blue-400 file:drop-shadow-lg
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                />
              </label>
              <div className="flex gap-2">
                <span>ไฟล์ที่คุณเลือกมีขนาด</span>
                <span>{fileSize}MB</span>
              </div>
              <div className="h-max max-h-[15rem] overflow-auto p-5  flex flex-col gap-2 w-full border-t-2">
                <div>ไฟล์เดิม</div>
                <ul className="w-full grid gap-5 grid-cols-4">
                  {assignmentData.files.map((file, index) => {
                    if (
                      file.type === "image/jpeg" ||
                      file.type === "" ||
                      file.type === "image/png"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full px-3 flex relative justify-start items-center gap-2 h-10
                         bg-white ring-2 ring-green-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-green-700">
                            <BsImageFill />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteFileOnAssignment({
                                fileOnAssignmentId: file.id,
                              })
                            }
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (
                      file.type === "video/mp4" ||
                      file.type === "video/quicktime"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full relative  px-3 flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-red-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-red-700">
                            <FcVideoFile />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteFileOnAssignment({
                                fileOnAssignmentId: file.id,
                              })
                            }
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (
                      file.type === "audio/mpeg" ||
                      file.type === "audio/mp3"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full relative px-3 flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-red-700">
                            <FaFileAudio />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteFileOnAssignment({
                                fileOnAssignmentId: file.id,
                              })
                            }
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (file.type === "application/pdf") {
                      return (
                        <div
                          key={index}
                          className="w-full px-3 relative flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-gray-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-gray-700">
                            <FaRegFilePdf />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteFileOnAssignment({
                                fileOnAssignmentId: file.id,
                              })
                            }
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (
                      file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full px-3 relative flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-blue-700">
                            <IoDocumentText />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteFileOnAssignment({
                                fileOnAssignmentId: file.id,
                              })
                            }
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="w-full relative px-3 flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-slate-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-slate-700">
                            <BsFileEarmarkCode />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteFileOnAssignment({
                                fileOnAssignmentId: file.id,
                              })
                            }
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    }
                  })}
                </ul>
              </div>

              <div className="h-max max-h-[15rem] overflow-auto p-5  flex flex-col gap-2 w-full border-t-2">
                <div>ไฟล์ใหม่</div>
                <ul className="w-full grid gap-5 grid-cols-4">
                  {selectedFiles.map((file, index) => {
                    if (
                      file.type === "image/jpeg" ||
                      file.type === "" ||
                      file.type === "image/png"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full px-3 flex relative justify-start items-center gap-2 h-10
                         bg-white ring-2 ring-green-500 rounded-xl"
                        >
                          <div className="flex items-center justify-start text-green-700">
                            <BsImageFill />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile({ file: file })}
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (
                      file.type === "video/mp4" ||
                      file.type === "video/quicktime"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full relative  px-3 flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-red-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-red-700">
                            <FcVideoFile />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile({ file: file })}
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (
                      file.type === "audio/mpeg" ||
                      file.type === "audio/mp3"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full relative px-3 flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-red-700">
                            <FaFileAudio />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile({ file: file })}
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (file.type === "application/pdf") {
                      return (
                        <div
                          key={index}
                          className="w-full px-3 relative flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-gray-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-gray-700">
                            <FaRegFilePdf />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile({ file: file })}
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else if (
                      file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ) {
                      return (
                        <div
                          key={index}
                          className="w-full px-3 relative flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-blue-700">
                            <IoDocumentText />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile({ file: file })}
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="w-full relative px-3 flex justify-start items-center gap-2 h-10 bg-white ring-2 ring-slate-500 rounded-xl"
                        >
                          <div className="flex items-center justify-center text-slate-700">
                            <BsFileEarmarkCode />
                          </div>
                          <span className="w-max max-w-[70%] text-sm truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile({ file: file })}
                            type="button"
                            className="w-8 h-8 hover:bg-red-300 transition-all duration-150 hover:text-red-800
                           absolute right-2 top-0 bottom-0 m-auto active:ring-2 active:ring-black
                         bg-red-200 rounded-full flex items-center justify-center text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
            <div className="w-40">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="w-40 py-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
          text-md cursor-pointer hover: active:border-2  active:border-gray-300
           active:border-solid  focus:border-2 hover:bg-red-500 transition duration-150
          focus:border-solid"
                >
                  {user.language === "Thai" && "อัปเดต"}
                  {user.language === "English" && "update"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form className="w-full h-full flex items-center justify-center flex-col gap-1">
          <div className="text-2xl font-Kanit font-semibold">
            {user.language === "Thai" && "เลือกผู้เรียนเพื่อมอบหมายงาน"}
            {user.language === "English" && "Choose students to assign work"}
          </div>

          <div
            className="w-11/12 h-full lg:max-h-[25rem] xl:max-h-[28rem] flex relative items-center
           justify-start overflow-auto scrollbar  flex-col "
          >
            {loading || studentOnAssignments.isLoading
              ? loadingCount.map((list, index) => {
                  return <Skeleton key={index} width="100%" height={80} />;
                })
              : isChecked?.map((student, index) => {
                  const oddNumber = index % 2;
                  return (
                    <div
                      key={student.id}
                      className={`grid grid-cols-4  w-full relative items-center justify-center ${
                        oddNumber === 0 ? "bg-white" : "bg-orange-100"
                      } py-2 
              text-lg font-Kanit `}
                    >
                      <div className="flex items-center justify-start">
                        {student.number}
                      </div>
                      <div className="flex items-center justify-start">
                        {student.firstName}
                      </div>
                      <div className="flex items-center justify-start">
                        {student?.lastName}
                      </div>
                      {student.status === "no-assign" ? (
                        <div className="flex items-center gap-5 justify-start ">
                          <div
                            className="w-max px-5 text-sm py-1 bg-gray-500  rounded-lg text-white
                      flex items-center justify-center"
                          >
                            {user.language === "Thai" && "ไม่ได้มอบหมาย"}
                            {user.language === "English" && "Already assigned"}
                          </div>
                          <input
                            checked={student.isAssign}
                            onChange={() =>
                              handleChangeCheck({ studentId: student.id })
                            }
                            type="checkbox"
                            className="w-6 h-6 ring-2 text-blue-600 bg-gray-100 border-gray-300 rounded
                   focus:ring-blue-500 dark:focus:ring-blue-600
                   dark:ring-offset-gray-800 focus:ring-2 ring-black dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      ) : (
                        <div className="flex justify-start gap-5 items-center">
                          <div
                            className="w-max px-5 text-sm py-1 bg-green-500  rounded-lg text-white
                      flex items-center justify-center"
                          >
                            {user.language === "Thai" && "มอบหมายแล้ว"}
                            {user.language === "English" && "Already assigned"}
                          </div>
                          {loadingItems.find(
                            (loadingItem) => loadingItem === student.id
                          ) ? (
                            <Loading />
                          ) : (
                            <button
                              onClick={() =>
                                handleUnDoAssignmentOnStudent({
                                  studentId: student.id,
                                })
                              }
                              type="button"
                              className="w-max select-none px-2 hover:bg-red-400 transition duration-100 active:scale-105
                         h-10 gap-2 bg-red-300 rounded-md flex items-center justify-center text-red-600"
                            >
                              <TiUserDelete />
                              <span className="text-xs">ยกเลิก</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
          <div className="flex gap-5 mt-4">
            <button
              type="button"
              onClick={onClickIsCheck}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {user.language === "Thai" && "เลือกผู้เรียนทั้งหมด"}
              {user.language === "English" && "Pick all students"}
            </button>
            <button
              type="button"
              onClick={onClickAssignWork}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {user.language === "Thai" && "มอบหมายงาน"}
              {user.language === "English" && "Assign"}
            </button>
          </div>
        </form>
      )}
    </form>
  );
}

export default UpdateAssignment;
