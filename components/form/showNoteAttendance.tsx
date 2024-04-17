import { Editor } from "@tinymce/tinymce-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { selectNote } from "../../pages/classroom/teacher/[classroomId]/attendance";
import { UseQueryResult } from "@tanstack/react-query";
import {
  ResponseGetAllAttendanceService,
  UpdateHeadAttendanceService,
} from "../../services/attendance";
import { filePickerCallback } from "../../utils/filePickerCallback";

type ShowNoteAttendanceProps = {
  setTriggerShowNote: React.Dispatch<React.SetStateAction<boolean>>;
  selectNote: selectNote | null | undefined;
  attendances: UseQueryResult<ResponseGetAllAttendanceService, Error>;
  classroomId: string;
};

function ShowNoteAttendance({
  setTriggerShowNote,
  selectNote,
  attendances,
  classroomId,
}: ShowNoteAttendanceProps) {
  const [note, setNote] = useState<{
    id: string;
    body: string;
    groupId: string;
  }>({
    id: selectNote?.headAttendance?.id as string,
    body: selectNote?.headAttendance?.note as string,
    groupId: selectNote?.groupId as string,
  });
  const handleEditorChange = (content: string) => {
    setNote((prev) => {
      return {
        ...prev,
        body: content,
      };
    });
  };

  const handleSummitUpdate = async () => {
    try {
      Swal.fire({
        title: "กำลังโหลด...",
        html: "รอสักครู่นะครับ...",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(note.body, "text/html");
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

      await UpdateHeadAttendanceService({
        imagesBase64: imageUrls as string[],
        note: note.body,
        headAttendanceId: note.id as string,
        classroomId: classroomId,
        groupId: note.groupId,
      });
      await attendances.refetch();
      setTriggerShowNote(() => false);
      document.body.style.overflow = "auto";
      Swal.fire("success", "Note has been updated", "success");
    } catch (err: any) {
      console.error(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };
  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ-0 z-50 font-Kanit">
      <div
        className="w-10/12 h-5/6 fixed z-40 top-0 bottom-0 right-0
   left-0 m-auto flex flex-col  items-center justify-center md:justify-start gap-2 bg-white p-0 md:p-5 rounded-lg  "
      >
        <Editor
          tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
          textareaName="note"
          value={note.body}
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
            toolbar:
              "undo redo | formatselect | blocks | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "link | image",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onEditorChange={handleEditorChange}
        />
        <button
          onClick={handleSummitUpdate}
          className="w-max font-normal text-base px-10 hover:bg-blue-600 text-white hover:drop-shadow-sm transition duration-150
         bg-blue-500 rounded-full py-1"
        >
          update
        </button>
      </div>

      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerShowNote(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default ShowNoteAttendance;
