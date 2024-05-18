import { Switch } from "@mui/material";
import React from "react";
import { Input, Label, TextField } from "react-aria-components";

type QuizeSidebarProps = {
  timeStart: string;
  timeEnd: string;
  limitAttemps: number;
  duration: number;
};
function QuizeSidebar() {
  return (
    <>
      <li className="mt-20 text-lg font-semibold text-main-color">
        การตั้งค่าแบบทดสอบ
      </li>
      <li className="w-full rounded-lg p-2 ring-1 ring-gray-300">
        <div className="flex items-center justify-center gap-2">
          <Switch color="primary" inputProps={{ "aria-label": "controlled" }} />
          <span className="text-base  font-semibold text-main-color">
            จำกัดเวลาแบบทดสอบ
          </span>
        </div>
        <TextField className="flex flex-col items-start">
          <Label>ระบุนาที</Label>
          <Input
            max={999}
            min={1}
            type="number"
            className="w-full rounded-lg border-2  border-gray-400 p-2 outline-2 outline-main-color "
            placeholder="นาที"
          />
        </TextField>
      </li>

      <li className="w-full rounded-lg p-2 ring-1 ring-gray-300">
        <div className="flex items-center justify-center gap-2">
          <Switch color="primary" inputProps={{ "aria-label": "controlled" }} />
          <span className="text-base  font-semibold text-main-color">
            จำกัดจำนวนครั้ง
          </span>
        </div>
        <TextField className="flex flex-col items-start">
          <Label>ระบุจำนวนครั้ง</Label>
          <Input
            max={999}
            min={1}
            type="number"
            className="w-full rounded-lg border-2  border-gray-400 p-2 outline-2 outline-main-color "
            placeholder="นาที"
          />
        </TextField>
      </li>
    </>
  );
}

export default QuizeSidebar;
