import { Switch } from "@mui/material";
import React from "react";
import { Input, Label, TextField } from "react-aria-components";

function QuizeSidebar() {
  return (
    <>
      <li className="text-main-color mt-20 font-semibold text-lg">
        การตั้งค่าแบบทดสอบ
      </li>
      <li className="ring-1 w-full ring-gray-300 rounded-lg p-2">
        <div className="flex justify-center items-center gap-2">
          <Switch color="primary" inputProps={{ "aria-label": "controlled" }} />
          <span className="text-main-color  font-semibold text-base">
            จำกัดเวลาแบบทดสอบ
          </span>
        </div>
        <TextField className="flex flex-col items-start">
          <Label>ระบุนาที</Label>
          <Input
            max={999}
            min={1}
            type="number"
            className="p-2 w-full rounded-lg  border-2 border-gray-400 outline-2 outline-main-color "
            placeholder="นาที"
          />
        </TextField>
      </li>

      <li className="ring-1 w-full ring-gray-300 rounded-lg p-2">
        <div className="flex justify-center items-center gap-2">
          <Switch color="primary" inputProps={{ "aria-label": "controlled" }} />
          <span className="text-main-color  font-semibold text-base">
            จำกัดจำนวนครั้ง
          </span>
        </div>
        <TextField className="flex flex-col items-start">
          <Label>ระบุจำนวนครั้ง</Label>
          <Input
            max={999}
            min={1}
            type="number"
            className="p-2 w-full rounded-lg  border-2 border-gray-400 outline-2 outline-main-color "
            placeholder="นาที"
          />
        </TextField>
      </li>
    </>
  );
}

export default QuizeSidebar;
