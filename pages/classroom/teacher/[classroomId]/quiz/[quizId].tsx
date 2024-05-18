import { Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Label,
  Input,
  Form,
  FieldError,
} from "react-aria-components";
import QuizeSidebar from "../../../../../components/classroom/quize/sidebars/quize-sidebar";
import QuestionSidebar from "../../../../../components/classroom/quize/sidebars/question-sidebar";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Examination, User } from "../../../../../models";
import { useRouter } from "next/router";
import {
  SideMenusThai,
  sideMenusEnglish,
} from "../../../../../data/menubarsClassroom";
import { GetUserCookieService } from "../../../../../services/user";
import { parseCookies } from "nookies";
import ClassroomLayout from "../../../../../layouts/classroomLayout";
import {
  GetExaminationService,
  ResponseGetExaminationService,
} from "../../../../../services/examination";
import { useQuery } from "@tanstack/react-query";

function CreateQuiz({ user }: { user: User }) {
  const router = useRouter();
  const [examination, setExamination] = useState<Examination>();
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
    setExamination((prev) => ({ ...prev, [name]: value }) as Examination);
  };

  console.log(examination);

  const [selectSidebar, setSelectSidebar] = useState<"quiz" | "question">(
    "quiz",
  );

  const examinationQuery = useQuery({
    queryKey: ["examination", router.query.quizId],
    queryFn: () =>
      GetExaminationService({
        examinationId: router.query.quizId as string,
      }),
  });

  useEffect(() => {
    if (examinationQuery.data) {
      setExamination(() => {
        return {
          id: examinationQuery.data.id,
          updateAt: examinationQuery.data.updateAt,
          createAt: examinationQuery.data.createAt,
          userId: examinationQuery.data.userId,
          title: examinationQuery.data.title,
          description: examinationQuery.data.description,
          duration: examinationQuery.data.duration,
          timeStart: examinationQuery.data.timeStart
            ? new Date(examinationQuery.data.timeStart as string)
                .toISOString()
                .slice(0, 16)
            : null,
          timeEnd: examinationQuery.data.timeEnd
            ? new Date(examinationQuery.data.timeEnd as string)
                .toISOString()
                .slice(0, 16)
            : null,
          limitAttemps: examinationQuery.data.limitAttemps,
          score: examinationQuery.data.score,
          classroomId: examinationQuery.data.classroomId,
        };
      });
      setSwitchData(() => {
        return {
          duration: examinationQuery.data.duration ? true : false,
          time:
            examinationQuery.data.timeStart && examinationQuery.data.timeEnd
              ? true
              : false,
          limitAttemps: examinationQuery.data.limitAttemps ? true : false,
        };
      });
    }
  }, [examinationQuery.data]);

  return (
    <div className="flex bg-[#F1F8FF] font-Kanit">
      <ul className="sticky left-0 top-0 flex h-screen w-80 flex-col items-center justify-start gap-5 bg-white p-5 drop-shadow-md">
        {selectSidebar === "quiz" ? <QuizeSidebar /> : <QuestionSidebar />}
      </ul>
      <Form className="flex w-10/12 flex-col items-center justify-start gap-5 p-10">
        <section
          onClick={() => setSelectSidebar(() => "quiz")}
          className="flex   max-h-max min-h-40 w-9/12  flex-col gap-2 rounded-lg bg-white p-5 px-20 drop-shadow-lg transition duration-150 active:ring-2 "
        >
          <TextField aria-label="title" className="w-full" isRequired>
            <Input
              name="title"
              value={examination?.title}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-main-color p-2 text-2xl outline-2 outline-main-color"
              placeholder="ชื่อแบบทดสอบ"
            />
            <FieldError className="text-sm text-red-800" />
          </TextField>
          <TextField className="w-full" aria-label="คำอธิบาย" isRequired>
            <Input
              name="description"
              value={examination?.description}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-main-color p-2 outline-2 outline-main-color"
              placeholder="คำอธิบาย"
            />
            <FieldError className="text-sm text-red-800" />
          </TextField>
          <section className="flex w-full flex-wrap gap-2">
            <div>
              <div className="flex items-center justify-start gap-2">
                <Switch
                  checked={swichData.duration}
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      setExamination((prev) => {
                        const newState = { ...prev };
                        delete newState.timeStart;
                        delete newState.timeEnd;
                        return newState as Examination;
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
                <span className="text-base  font-semibold text-main-color">
                  จำกัดเวลาแบบทดสอบ
                </span>
              </div>
              <TextField className="flex flex-col items-start">
                <Label>ระบุนาที</Label>
                <Input
                  disabled={!swichData.duration}
                  name="duration"
                  onChange={handleChange}
                  value={examination?.duration ?? ""}
                  max={999}
                  min={1}
                  type="number"
                  className="h-10 w-60 rounded-lg border-2  border-main-color p-2 outline-2 outline-main-color "
                  placeholder="นาที"
                />
                <FieldError className="text-sm text-red-800" />
              </TextField>
            </div>
            <div>
              <div className="flex items-center justify-start gap-2">
                <Switch
                  checked={swichData.time}
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      setExamination((prev) => {
                        const newState = { ...prev };
                        delete newState.duration;
                        return newState as Examination;
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
                <span className="text-base  font-semibold text-main-color">
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
                    value={examination?.timeStart ?? ""}
                    onChange={handleChange}
                    type="datetime-local"
                    className="h-10 w-60 rounded-lg border-2  border-main-color p-2 outline-2 outline-main-color "
                    placeholder="นาที"
                  />
                  <FieldError className="text-sm text-red-800" />
                </TextField>
                <TextField className="flex flex-col items-start">
                  <Label>จบแบบทดสอบเมื่อ</Label>
                  <Input
                    disabled={!swichData.time}
                    name="timeEnd"
                    value={examination?.timeEnd ?? ""}
                    onChange={handleChange}
                    min={examination?.timeStart ?? new Date().toISOString()}
                    type="datetime-local"
                    className="h-10 w-60 rounded-lg border-2  border-main-color p-2 outline-2 outline-main-color "
                    placeholder="นาที"
                  />
                  <FieldError className="text-sm text-red-800" />
                </TextField>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-start gap-2">
                <Switch
                  checked={swichData.limitAttemps}
                  onChange={(e) => {
                    setSwitchData((prev) => ({
                      ...prev,
                      limitAttemps: e.target.checked,
                    }));
                    if (e.target.checked === false) {
                      setExamination((prev) => {
                        const newState = { ...prev };
                        delete newState.limitAttemps;
                        return newState as Examination;
                      });
                    }
                  }}
                  color="primary"
                  inputProps={{ "aria-label": "controlled" }}
                />
                <span className="text-base  font-semibold text-main-color">
                  จำกัดจำนวนครั้ง
                </span>
              </div>
              <TextField
                aria-label="จำกัดการทำแบบทดสอบ"
                className="flex flex-col items-start"
              >
                <Input
                  value={examination?.limitAttemps ?? 0}
                  disabled={!swichData.limitAttemps}
                  max={999}
                  min={1}
                  name="limitAttemps"
                  onChange={handleChange}
                  type="number"
                  className="h-10 w-60 rounded-lg border-2  border-main-color p-2 outline-2 outline-main-color "
                  placeholder="ครั้ง"
                />
                <FieldError className="text-sm text-red-800" />
              </TextField>
            </div>
          </section>
        </section>
        <section
          onClick={() => setSelectSidebar(() => "question")}
          className="flex  max-h-max min-h-40 w-9/12  flex-col gap-2 rounded-lg bg-white p-5 px-20 drop-shadow-lg transition duration-150 active:ring-2"
        >
          <TextField isRequired>
            <Input
              className="w-full rounded-lg border-2 border-main-color p-2 text-2xl outline-2 outline-main-color"
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
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  if (accessToken) {
    try {
      const user = await GetUserCookieService({
        access_token: accessToken,
      });
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signIn",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signIn",
      },
    };
  }
};
