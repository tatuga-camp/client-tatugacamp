import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { GrScorecard } from "react-icons/gr";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete, MdError } from "react-icons/md";
import { Box, TextField } from "@mui/material";
import { FcCancel, FcVideoFile } from "react-icons/fc";
import { BsFileEarmarkCode, BsImageFill } from "react-icons/bs";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Assignment, Score, Student, User } from "../../models";
import { UseQueryResult } from "@tanstack/react-query";
import {
  AssignWorkToStudentService,
  CreateAssignmentService,
  CreateFileOnAssignmentService,
  ResponseGetAllAssignmentsService,
} from "../../services/assignment";
import { ResponseGetAllStudentsService } from "../../services/students";
import { filePickerCallback } from "../../utils/filePickerCallback";
import Loading from "../loadings/loading";
import CreateAssignWorkToStudent from "./createAssignWorkToStudent";

type CreateAssignmentProps = {
  user: User;
  assignments: UseQueryResult<ResponseGetAllAssignmentsService, Error>;
  setTriggerAssignment: React.Dispatch<React.SetStateAction<boolean>>;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
};
export default function CreateAssignment({
  setTriggerAssignment,
  students,
  assignments,
  user,
}: CreateAssignmentProps) {
  const rounter = useRouter();
  const [fileSize, setFilesSize] = useState<string>("0");
  const [selectedFiles, setSelectedFiles] = useState<File[]>();
  const [assignmentCreated, setAssignmentCreated] = useState<Assignment>();

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    body: "",
    deadline: "",
    maxScore: "",
  });
  const [isAssignStudent, setIsAssignmentStdent] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.prototype.slice.call(e.target.files);
    let totalSize = 0;

    // Combine the existing selected files with the newly selected files
    const updatedSelectedFiles = [...(selectedFiles || []), ...newFiles];
    for (let i = 0; i < updatedSelectedFiles.length; i++) {
      totalSize += updatedSelectedFiles[i].size;
    }

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    setFilesSize(() => totalSizeInMB);

    setSelectedFiles(() => updatedSelectedFiles);
  };

  const handleSubmitCreateAssignment = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formFiles = new FormData();
      selectedFiles?.forEach((file) => {
        formFiles.append("files", file);
      });
      setLoading(() => true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(assignmentData.body, "text/html");
      const imageElements = doc.getElementsByTagName("img");
      const imageUrls = Array.from(imageElements).map((img) => img.src);

      if (assignmentData.body === "") {
        throw new Error("กรุณาใส่คำอธิบายชิ้นงาน");
      }
      const createAssignment = await CreateAssignmentService({
        classroomId: rounter.query.classroomId as string,
        title: assignmentData.title,
        description: assignmentData.body,
        maxScore: Number(assignmentData.maxScore),
        deadline: assignmentData.deadline,
        imagesBase64: imageUrls,
      });

      await CreateFileOnAssignmentService({
        formFiles: formFiles,
        assignmentId: createAssignment.id,
      });
      await assignments.refetch();
      Swal.fire("success", "assignment has been createed", "success");
      setLoading(() => false);
      setAssignmentCreated(() => createAssignment);
      setIsAssignmentStdent(true);
    } catch (err: any) {
      setLoading(() => false);
      Swal.fire("error", err?.message?.toString(), "error");
    }
  };

  const handleEditorChange = (content: string) => {
    setAssignmentData((prev) => {
      return {
        ...prev,
        body: content,
      };
    });
  };

  const handleRemoveFile = ({ file }: { file: File }) => {
    const updatedSelectedFiles = selectedFiles?.filter(
      (selectedFile) => selectedFile !== file,
    );
    setSelectedFiles(() => updatedSelectedFiles);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-40 m-auto flex h-screen w-screen items-center justify-center">
      <main
        onSubmit={handleSubmitCreateAssignment}
        className="flex h-screen w-screen items-start  justify-center bg-white font-Kanit"
      >
        {isAssignStudent && assignmentCreated ? (
          <CreateAssignWorkToStudent
            user={user}
            setIsAssignmentStdent={setIsAssignmentStdent}
            setTriggerAssignment={setTriggerAssignment}
            assignmentCreated={assignmentCreated}
          />
        ) : (
          <form
            className="flex h-screen flex-col items-center justify-start gap-10
          overflow-auto bg-white px-4 pt-20  md:w-10/12 lg:w-11/12 xl:w-8/12 "
          >
            <div className="mt-5 h-max w-full flex-col  ">
              <div className="mb-3 flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => {
                    document.body.style.overflow = "auto";
                    setIsAssignmentStdent(false);
                    setTriggerAssignment(false);
                  }}
                  className="flex items-center justify-center gap-1 text-3xl"
                >
                  <FcCancel />
                  <span className="text-lg text-red-400">
                    {user.language === "Thai"
                      ? "ยกเลิก"
                      : user.language === "English" && "Cancel"}
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-0">
                <Box width="100%">
                  <TextField
                    required
                    name="title"
                    onChange={handleChange}
                    fullWidth
                    label="title"
                  />
                </Box>
              </div>
              <div className="mt-5 h-96">
                <label>คำอธิบาย</label>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                  textareaName="description"
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
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>
            <div className="flex w-full flex-wrap items-end justify-start gap-5">
              <div className=" mt-0 flex flex-col ">
                <label>
                  {user.language === "Thai" && "กำหนดส่ง"}
                  {user.language === "English" && "Due by"}
                </label>
                <input
                  onChange={handleChange}
                  name="deadline"
                  className="w-60 appearance-none rounded-md border-none px-5  py-2 text-lg 
                outline-none ring-2 ring-gray-200 focus:ring-black "
                  type="datetime-local"
                  placeholder="Please select a date"
                  required
                />
              </div>
              <div className=" relative mt-0 flex flex-col ">
                <label>
                  {user.language === "Thai" && "คะแนนของงาน"}
                  {user.language === "English" && "socres"}
                </label>
                <input
                  min="1"
                  onChange={handleChange}
                  name="maxScore"
                  className="w-60 appearance-none rounded-md border-none px-5 py-2 text-lg 
                outline-none ring-2 ring-gray-200 placeholder:text-sm focus:ring-black"
                  type="number"
                  step="0.01"
                  required
                  placeholder={
                    user.language === "Thai" ? "ใส่คะแนนของงาน" : "put scores"
                  }
                />
                <div className="absolute right-5 top-8 text-lg">
                  <GrScorecard />
                </div>
              </div>
              <label
                htmlFor="dropzone-file"
                className="flex h-max w-max flex-col items-center justify-center gap-1"
              >
                <div
                  className="flex h-max w-max cursor-pointer items-center justify-center
                   rounded-2xl bg-white px-5 py-2 text-2xl  text-black ring-2 ring-black drop-shadow-xl transition duration-150 hover:scale-105"
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
                  className="text-grey-500 hidden w-max  appearance-none rounded-full
            bg-white text-sm ring-2 file:mr-5 file:w-40
            file:rounded-full file:border-0
            file:bg-blue-400 file:py-2 file:font-Kanit file:text-sm
             file:font-normal file:text-white
            file:drop-shadow-lg hover:file:cursor-pointer
            hover:file:bg-amber-50 hover:file:text-amber-700
            md:file:w-40
          "
                />
              </label>
              <div className="flex gap-2">
                <span>ไฟล์ที่คุณเลือกมีขนาด</span>
                <span>{fileSize}MB</span>
              </div>
            </div>
            <div className="flex h-60 w-full flex-col gap-2 border-t-2">
              <div>ไฟล์</div>
              <ul className="grid w-full grid-cols-4 gap-5">
                {selectedFiles?.map((file, index) => {
                  if (
                    file.type === "image/jpeg" ||
                    file.type === "" ||
                    file.type === "image/png"
                  ) {
                    return (
                      <div
                        key={index}
                        className="relative flex h-10 w-full items-center justify-center gap-2 rounded-xl
                       bg-white px-1 ring-2 ring-green-500"
                      >
                        <div className="flex items-center justify-center text-green-700">
                          <BsImageFill />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile({ file: file })}
                          type="button"
                          className="absolute bottom-0 right-2 top-0 m-auto flex
                         h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700
                       transition-all duration-150 hover:bg-red-300 hover:text-red-800 active:ring-2 active:ring-black"
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
                        className="relative flex  h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-1 ring-2 ring-red-500"
                      >
                        <div className="flex items-center justify-center text-red-700">
                          <FcVideoFile />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile({ file: file })}
                          type="button"
                          className="absolute bottom-0 right-2 top-0 m-auto flex
                         h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700
                       transition-all duration-150 hover:bg-red-300 hover:text-red-800 active:ring-2 active:ring-black"
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
                        className="relative flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-1 ring-2 ring-blue-500"
                      >
                        <div className="flex items-center justify-center text-red-700">
                          <FaFileAudio />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile({ file: file })}
                          type="button"
                          className="absolute bottom-0 right-2 top-0 m-auto flex
                         h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700
                       transition-all duration-150 hover:bg-red-300 hover:text-red-800 active:ring-2 active:ring-black"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    );
                  } else if (file.type === "application/pdf") {
                    return (
                      <div
                        key={index}
                        className="relative flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-1 ring-2 ring-gray-500"
                      >
                        <div className="flex items-center justify-center text-gray-700">
                          <FaRegFilePdf />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile({ file: file })}
                          type="button"
                          className="absolute bottom-0 right-2 top-0 m-auto flex
                         h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700
                       transition-all duration-150 hover:bg-red-300 hover:text-red-800 active:ring-2 active:ring-black"
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
                        className="relative flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-1 ring-2 ring-blue-500"
                      >
                        <div className="flex items-center justify-center text-blue-700">
                          <IoDocumentText />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile({ file: file })}
                          type="button"
                          className="absolute bottom-0 right-2 top-0 m-auto flex
                         h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700
                       transition-all duration-150 hover:bg-red-300 hover:text-red-800 active:ring-2 active:ring-black"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className="relative flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-1 ring-2 ring-slate-500"
                      >
                        <div className="flex items-center justify-center text-slate-700">
                          <BsFileEarmarkCode />
                        </div>
                        <span className="w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile({ file: file })}
                          type="button"
                          className="absolute bottom-0 right-2 top-0 m-auto flex
                         h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700
                       transition-all duration-150 hover:bg-red-300 hover:text-red-800 active:ring-2 active:ring-black"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    );
                  }
                })}
              </ul>
            </div>
            {loading ? (
              <div className="flex justify-center">
                <Loading />
              </div>
            ) : (
              <div className="mb-5 flex w-full justify-center">
                <button
                  type="submit"
                  className="text-md hover: mt-2 w-40 cursor-pointer rounded-full bg-[#2C7CD1] py-2
              font-sans font-bold text-white transition  duration-150
               hover:bg-red-500  focus:border-2 focus:border-solid active:border-2 active:border-solid
              active:border-gray-300"
                >
                  {user.language === "Thai" && "สร้าง"}
                  {user.language === "English" && "CREATE"}
                </button>
              </div>
            )}
          </form>
        )}
      </main>
      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setIsAssignmentStdent(false);
          setTriggerAssignment(false);
        }}
        className="fixed bottom-0 left-0 right-0 top-0 -z-10 m-auto h-screen w-screen bg-black/30 "
      ></div>
    </div>
  );
}
