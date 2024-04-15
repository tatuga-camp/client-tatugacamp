import { Switch } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import Swal from "sweetalert2";
import { CreateExaminationService } from "../../services/examination";

type CreateQuizProps = {
  setTriggerCreateProps: React.Dispatch<React.SetStateAction<boolean>>;
};
function CreateQuiz({ setTriggerCreateProps }: CreateQuizProps) {
  const router = useRouter();
  const [createQuizData, setCreateQuizData] = useState<{
    timeStart?: string;
    timeEnd?: string;
    duration?: number;
    title?: string;
    description?: string;
    limitAttemps?: number;
    score?: number;
    classroomId?: string;
  }>({
    classroomId: router.query.classroomId as string,
  });
  const [swichData, setSwitchData] = useState<{
    duration: boolean;
    time: boolean;
    limitAttemps: boolean;
  }>({
    duration: true,
    time: false,
    limitAttemps: false,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateQuizData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังสร้างแบบทดสอบ",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      if (!createQuizData.title || !createQuizData.classroomId) {
        throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
      }
      const examination = await CreateExaminationService({
        timeStart:
          createQuizData.timeStart &&
          new Date(createQuizData.timeStart).toISOString(),
        timeEnd:
          createQuizData.timeEnd &&
          new Date(createQuizData.timeEnd).toISOString(),
        duration: createQuizData.duration,
        title: createQuizData.title,
        description: createQuizData.description,
        limitAttemps: createQuizData.limitAttemps,
        score: createQuizData.score,
        classroomId: createQuizData.classroomId,
      });
      Swal.fire({
        icon: "success",
        title: "สร้างแบบทดสอบสำเร็จ",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };
  return (
    <div className="w-screen  font-Kanit flex items-center justify-center h-screen z-50 fixed top-0 bottom-0 left-0 right-0 m-auto">
      <Form
        onSubmit={handleCreateQuiz}
        className="w-8/12 items-center   flex flex-col gap-2 p-5 px-20 min-h-40 max-h-max bg-white rounded-lg drop-shadow-lg"
      >
        <TextField aria-label="title" className="w-full" isRequired>
          <Input
            name="title"
            value={createQuizData.title}
            onChange={handleChange}
            className="w-full text-2xl p-2 rounded-lg border-2 border-gray-400 outline-2 outline-main-color"
            placeholder="ชื่อแบบทดสอบ"
          />
          <FieldError className="text-sm text-red-800" />
        </TextField>
        <TextField className="w-full" aria-label="คำอธิบาย" isRequired>
          <Input
            name="description"
            value={createQuizData.description}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border-2 border-gray-400 outline-2 outline-main-color"
            placeholder="คำอธิบาย"
          />
          <FieldError className="text-sm text-red-800" />
        </TextField>
        <section className="w-full flex gap-2 flex-wrap">
          <div>
            <div className="flex justify-start items-center gap-2">
              <Switch
                checked={swichData.duration}
                onChange={(e) => {
                  if (e.target.checked === true) {
                    setCreateQuizData((prev) => {
                      const newState = { ...prev };
                      delete newState.timeStart;
                      delete newState.timeEnd;
                      return newState;
                    });
                  }
                  setSwitchData((prev) => ({
                    ...prev,
                    duration: e.target.checked,
                    time: e.target.checked === true ? false : true,
                  }));
                }}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
              />
              <span className="text-main-color  font-semibold text-base">
                จำกัดเวลาแบบทดสอบ
              </span>
            </div>
            <TextField className="flex flex-col items-start">
              <Label>ระบุนาที</Label>
              <Input
                disabled={!swichData.duration}
                name="duration"
                onChange={handleChange}
                value={createQuizData.duration ?? ""}
                max={999}
                min={1}
                type="number"
                className="p-2 h-10 w-60 rounded-lg  border-2 border-gray-400 outline-2 outline-main-color "
                placeholder="นาที"
              />
              <FieldError className="text-sm text-red-800" />
            </TextField>
          </div>
          <div>
            <div className="flex justify-start items-center gap-2">
              <Switch
                checked={swichData.time}
                onChange={(e) => {
                  if (e.target.checked === true) {
                    setCreateQuizData((prev) => {
                      const newState = { ...prev };
                      delete newState.duration;
                      return newState;
                    });
                  }
                  setSwitchData((prev) => ({
                    ...prev,
                    duration: e.target.checked === true ? false : true,
                    time: e.target.checked,
                  }));
                }}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
              />
              <span className="text-main-color  font-semibold text-base">
                ระบุช่วงเวลา
              </span>
            </div>
            <div className="flex gap-2">
              <TextField
                aria-label="timeStart"
                className="flex flex-col items-start"
              >
                <Label>เริ่มต้นแบบทดสอบเมื่อ</Label>
                <Input
                  disabled={!swichData.time}
                  name="timeStart"
                  value={createQuizData.timeStart ?? ""}
                  onChange={handleChange}
                  type="datetime-local"
                  className="p-2 w-60 rounded-lg h-10  border-2 border-gray-400 outline-2 outline-main-color "
                  placeholder="นาที"
                />
                <FieldError className="text-sm text-red-800" />
              </TextField>
              <TextField className="flex flex-col items-start">
                <Label>จบแบบทดสอบเมื่อ</Label>
                <Input
                  disabled={!swichData.time}
                  name="timeEnd"
                  value={createQuizData.timeEnd ?? ""}
                  onChange={handleChange}
                  min={createQuizData.timeStart}
                  type="datetime-local"
                  className="p-2 w-60 h-10 rounded-lg  border-2 border-gray-400 outline-2 outline-main-color "
                  placeholder="นาที"
                />
                <FieldError className="text-sm text-red-800" />
              </TextField>
            </div>
          </div>

          <div>
            <div className="flex justify-start items-center gap-2">
              <Switch
                checked={swichData.limitAttemps}
                onChange={(e) => {
                  setSwitchData((prev) => ({
                    ...prev,
                    limitAttemps: e.target.checked,
                  }));
                }}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
              />
              <span className="text-main-color  font-semibold text-base">
                จำกัดจำนวนครั้ง
              </span>
            </div>
            <TextField
              aria-label="จำกัดการทำแบบทดสอบ"
              className="flex flex-col items-start"
            >
              <Input
                value={createQuizData.limitAttemps}
                disabled={!swichData.limitAttemps}
                max={999}
                min={1}
                name="limitAttemps"
                onChange={handleChange}
                type="number"
                className="p-2 h-10 w-60 rounded-lg  border-2 border-gray-400 outline-2 outline-main-color "
                placeholder="ครั้ง"
              />
              <FieldError className="text-sm text-red-800" />
            </TextField>
          </div>
        </section>
        <Button
          type="submit"
          className="w-80 active:scale-105 transition drop-shadow-lg mt-5 h-10 bg-main-color text-white font-semibold rounded-lg"
        >
          สร้างแบบทดสอบ
        </Button>
      </Form>
      <footer
        onClick={() => setTriggerCreateProps(() => false)}
        className="w-screen h-screen -z-10 fixed top-0 bg-black/50 bottom-0 left-0 right-0 m-auto"
      ></footer>
    </div>
  );
}

export default CreateQuiz;
