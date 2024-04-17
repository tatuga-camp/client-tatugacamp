import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Swal from "sweetalert2";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { tagsEnglish, tagsThai } from "../../data/tagsFeedback";
import { CreateFeedbackService } from "../../services/feedback";
import { User } from "../../models";
import { filePickerCallback } from "../../utils/filePickerCallback";
import { Skeleton } from "@mui/material";
type CreateFeedbackProps = {
  handleCloseFeedback: () => void;
  language: "Thai" | "English";
  user: User;
};

function CreateFeedback({
  handleCloseFeedback,
  language,
  user,
}: CreateFeedbackProps) {
  const [loadingEditor, setLoadingEditor] = useState(true);
  const [tags, setTag] = useState(() => {
    if (language === "Thai") {
      return tagsThai;
    } else if (language === "English") {
      return tagsEnglish;
    } else {
      return tagsThai;
    }
  });
  const [feedbackData, setFeedbackData] = useState({
    body: "",
    tag: "",
  });
  const [activeTag, setActiveTag] = useState<number>();
  const [checkAuth, setCheckAuth] = useState<{
    unAuth: boolean;
    auth: boolean;
  }>({
    unAuth: false,
    auth: true,
  });
  const handleChangeCheckAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckAuth(() => {
      if (name === "unAuth") {
        return {
          [name]: checked,
          auth: false,
        };
      } else if (name === "auth") {
        return {
          [name]: checked,
          unAuth: false,
        };
      } else {
        return {
          unAuth: false,
          auth: false,
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const feedback = await CreateFeedbackService({
        body: feedbackData.body,
        tag: feedbackData.tag,
        checkAuth: checkAuth,
        userId: user.id,
      });
      Swal.fire("success", "Your feedback has been sent", "success");
      handleCloseFeedback();
    } catch (err: any) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };
  return (
    <div>
      <div
        className="flex w-screen h-screen font-Kanit bg-transparent  z-40 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <div
          className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
        >
          <form
            className=" w-max flex flex-col justify-center items-start "
            onSubmit={handleSubmit}
          >
            <span className="text-xl mb-6 font-semibold text-[#2C7CD1]">
              {language === "Thai" && "ท่านคิดเห็นอย่างไรกับ Tatuga class"}
              {language === "English" && "What do you think of tatuga class?"}
            </span>
            <div className="text-md  mb-6 font-normal text-black flex md:gap-6 gap-3 flex-col md:flex-row">
              <span>
                {language === "Thai" && "ท่านต้องการระบุตัวตนหรือไม่"}
                {language === "English" && "Do you want to identify yourself?"}
              </span>
              <div className="flex gap-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">
                    {language === "Thai" && "ไม่ต้องการ"}
                    {language === "English" && "NO"}
                  </span>
                  <input
                    type="checkbox"
                    name="unAuth"
                    checked={checkAuth.unAuth}
                    onChange={handleChangeCheckAuth}
                  />
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">
                    {language === "Thai" && "ต้องการ"}
                    {language === "English" && "YES"}
                  </span>
                  <input
                    type="checkbox"
                    name="auth"
                    checked={checkAuth.auth}
                    onChange={handleChangeCheckAuth}
                  />
                </div>
              </div>
            </div>
            <div className="w-80 relative md:w-full h-80">
              {loadingEditor && (
                <div className=" absolute z-50 w-full h-full bg-slate-300 animate-pulse" />
              )}
              <Editor
                tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
                textareaName="description"
                init={{
                  link_context_toolbar: true,
                  height: "100%",
                  width: "100%",
                  menubar: false,
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: "image",
                  file_picker_callback: filePickerCallback,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                    "link",
                    "image",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help | link | image",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onLoadContent={() => setLoadingEditor(() => false)}
                onEditorChange={(newText) =>
                  setFeedbackData((prev) => {
                    return {
                      ...prev,
                      body: newText,
                    };
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mt-4">
              {tags.map((tag, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTag(() => index);
                      setFeedbackData((prev) => {
                        return {
                          ...prev,
                          tag: tag.title,
                        };
                      });
                    }}
                    className={`md:p-4 p-1 border-2 gap-2 transition duration-150 hover:scale-110 hover:border-orange-300
                     border-solid rounded-xl  ${
                       activeTag === index
                         ? "border-orange-500"
                         : "border-gray-200"
                     } items-center justify-center w-full flex`}
                    type="button"
                  >
                    <div className="flex items-center justify-center">
                      {<tag.icon />}
                    </div>
                    <span>{tag.title}</span>
                  </button>
                );
              })}
            </div>
            <button
              className="w-28  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
            >
              {language === "Thai" && "ส่ง"}
              {language === "English" && "summit"}
            </button>
          </form>
        </div>
        <div
          onClick={() => handleCloseFeedback()}
          className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
        ></div>
      </div>
    </div>
  );
}

export default CreateFeedback;
