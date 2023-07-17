import React, { useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";

import { useRouter } from "next/router";
import { CreateGroupApi } from "../../service/group";
import Loading from "../../components/loading/loading";
import { MdGroup } from "react-icons/md";

function CreateGroup({ close, language, groups }) {
  const router = useRouter();
  const [groupData, setGroupData] = useState({
    title: "",
    groupNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    try {
      setLoading(() => true);
      e.preventDefault();
      await CreateGroupApi({
        title: groupData.title,
        groupNumber: groupData.groupNumber,
        classroomId: router.query.classroomId,
      });
      groups?.refetch();
      close();
      setLoading(() => false);
      Swal.fire("success", "create classroom success", "success");
      document.body.style.overflow = "auto";
    } catch (err) {
      setLoading(() => false);
      document.body.style.overflow = "auto";
      console.log("err", err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  const handleChagne = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
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
            className=" w-80 flex flex-col justify-center items-center "
            onSubmit={handleSubmit}
          >
            <span className="text-xl font-semibold text-[#2C7CD1]">
              {language === "Thai" && "แบ่งกลุ่ม"}
              {language === "English" && "Create group"}
            </span>
            <div className="flex flex-col relative">
              <label className="font-sans font-normal">
                {language === "Thai" && "หัวข้อ"}
                {language === "English" && "title"}
              </label>
              <input
                onChange={handleChagne}
                className="w-60 h-7 rounded-md ring-2   pl-10 
                placeholder:italic placeholder:font-light"
                type="text"
                name="title"
                placeholder={
                  language === "Thai"
                    ? "เช่น กลุ่มสำหรับเล่นกิจกรรม"
                    : language === "English" && "Ex. group for do activity"
                }
                maxLength="20"
              />
              <div
                className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <FcBusinessContact />
              </div>
            </div>

            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">
                {language === "Thai" && "จำนวนกลุ่ม"}
                {language === "English" && "number of groups"}
              </label>
              <input
                onChange={handleChagne}
                className="w-60 h-7 rounded-md  ring-2  pl-10 
                placeholder:italic placeholder:font-light"
                type="number"
                min="1"
                name="groupNumber"
                placeholder={
                  language === "Thai" ? "เช่น 5" : language === "English" && "5"
                }
              />
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <MdGroup />
              </div>
            </div>

            {loading ? (
              <div className="mt-2">
                <Loading />
              </div>
            ) : (
              <button
                aria-label="create classroom button"
                className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                {language === "Thai" && "สร้าง"}
                {language === "English" && "create"}
              </button>
            )}
          </form>
        </div>
        <div
          onClick={() => {
            close();
            document.body.style.overflow = "auto";
          }}
          className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
        ></div>
      </div>
    </div>
  );
}

export default CreateGroup;
