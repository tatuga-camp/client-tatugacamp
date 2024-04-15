import { Switch } from "@mui/material";
import React, { useState } from "react";
import {
  TextField,
  Label,
  Input,
  Form,
  FieldError,
} from "react-aria-components";
import QuizeSidebar from "../../../../../components/classroom/quize/sidebars/quize-sidebar";
import QuestionSidebar from "../../../../../components/classroom/quize/sidebars/question-sidebar";

function CreateQuiz() {
  const [selectSidebar, setSelectSidebar] = useState<"quiz" | "question">(
    "quiz"
  );
  return (
    <div className="bg-[#F1F8FF] font-Kanit flex">
      <ul className="w-80 gap-5 h-screen sticky top-0 left-0 flex flex-col justify-start items-center bg-white drop-shadow-md p-5">
        {selectSidebar === "quiz" ? <QuizeSidebar /> : <QuestionSidebar />}
      </ul>
      <Form className="w-10/12 flex p-10 flex-col justify-start items-center gap-5">
        <section
          onClick={() => setSelectSidebar(() => "quiz")}
          className="w-9/12  active:scale-105 transition duration-150  flex flex-col gap-2 p-5 px-20 min-h-40 max-h-max bg-white rounded-lg drop-shadow-lg"
        >
          <TextField isRequired>
            <Input
              className="w-full text-2xl p-2 rounded-lg border-2 border-gray-400 outline-2 outline-main-color"
              placeholder="ชื่อแบบทดสอบ"
            />
            <FieldError className="text-sm text-red-800" />
          </TextField>
          <TextField aria-label="คำอธิบาย" isRequired>
            <Input
              className="w-full p-2 rounded-lg border-2 border-gray-400 outline-2 outline-main-color"
              placeholder="คำอธิบาย"
            />
            <FieldError className="text-sm text-red-800" />
          </TextField>
        </section>
        <section
          onClick={() => setSelectSidebar(() => "question")}
          className="w-9/12  active:scale-105 transition duration-150  flex flex-col gap-2 p-5 px-20 min-h-40 max-h-max bg-white rounded-lg drop-shadow-lg"
        >
          <TextField isRequired>
            <Input
              className="w-full text-2xl p-2 rounded-lg border-2 border-gray-400 outline-2 outline-main-color"
              placeholder="คำถาม"
            />
            <FieldError className="text-sm text-red-800" />
          </TextField>
        </section>
      </Form>
    </div>
  );
}

export default CreateQuiz;
