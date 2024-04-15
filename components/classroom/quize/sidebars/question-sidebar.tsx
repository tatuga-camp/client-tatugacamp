import { MenuItem, Select, Switch } from "@mui/material";
import React from "react";
import { Input, Label, TextField } from "react-aria-components";
import { BiSolidCategory } from "react-icons/bi";
import { IoMdTime } from "react-icons/io";
import { FaRankingStar, FaRegCopy } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";

function QuestionSidebar() {
  return (
    <>
      <li className="ring-1 flex flex-col gap-2 w-full mt-20 ring-gray-300 rounded-lg p-2">
        <div className="flex text-xl justify-start items-center gap-2">
          <BiSolidCategory className="text-main-color" />

          <span className="text-main-color  font-semibold text-base">
            ประเภทคำตอบ
          </span>
        </div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className="w-full h-10 rounded-lg outline-main-color "
        >
          <MenuItem value={10}>หลายตัวเลือก</MenuItem>
          <MenuItem value={20}>คำตอบสั้นๆ</MenuItem>
          <MenuItem value={30}>ถูกหรืิอผิด</MenuItem>
        </Select>
      </li>
      <li className="ring-1 flex flex-col gap-2 w-full  ring-gray-300 rounded-lg p-2">
        <div className="flex text-xl justify-start items-center gap-2">
          <IoMdTime className="text-main-color" />

          <span className="text-main-color  font-semibold text-base">เวลา</span>
        </div>
        <TextField className="flex flex-col items-start">
          <Input
            max={999}
            min={1}
            type="number"
            className="p-2 w-full h-10 rounded-lg  border border-gray-400 outline-2 outline-main-color "
            placeholder="นาที"
          />
        </TextField>
      </li>
      <li className="ring-1 flex flex-col gap-2 w-full  ring-gray-300 rounded-lg p-2">
        <div className="flex text-xl justify-start items-center gap-2">
          <FaRankingStar className="text-main-color" />

          <span className="text-main-color  font-semibold text-base">
            คะแนน
          </span>
        </div>
        <TextField className="flex flex-col items-start">
          <Input
            max={999}
            min={0}
            type="number"
            className="p-2 w-full h-10 rounded-lg  border border-gray-400 outline-2 outline-main-color "
            placeholder="คะแนน"
          />
        </TextField>
      </li>
      <li className="w-full p-2 gap-2 grid grid-cols-2">
        <button className="w-full flex hover:bg-green-800 hover:text-green-300 active:scale-105 transition duration-150 justify-center items-center gap-2 col-span-1 h-10 bg-green-300 text-green-700 font-semibold rounded-lg">
          คัดลอก <FaRegCopy />
        </button>
        <button className="w-full flex hover:bg-red-600 hover:text-red-300 active:scale-105 transition duration-150 justify-center items-center gap-2 col-span-1 bg-red-300 text-red-700 font-semibold rounded-lg">
          ลบ <MdDelete />
        </button>
        <button className="w-full flex  active:scale-105 transition duration-150 justify-center items-center gap-2 col-span-2 h-10 bg-main-color text-white font-semibold rounded-lg">
          บันทึกคำถาม <FaSave />
        </button>
      </li>
    </>
  );
}

export default QuestionSidebar;
