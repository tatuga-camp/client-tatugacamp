import { useRouter } from "next/router";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import UpdateScore from "../../../../components/form/updateScore";
import { Skeleton } from "@mui/material";
import { parseCookies } from "nookies";
import {
  SideMenusThai,
  sideMenusEnglish,
} from "../../../../data/menubarsClassroom";
import Trophy from "../../../../components/svgs/Trophy";
import DisplayGroup from "../../../../components/group/displayGroup";
import SelectStudentMultipleScoreUpdate from "../../../../components/form/selectStudentMultipleScoreUpdate";
import UpdateScoreMultiple from "../../../../components/form/updateScoreMultiple";
import AdBanner from "../../../../components/ads/adBanner";
import { blurDataURL } from "../../../../data/student/blurDataURL";
import { Score, Student, StudentWithScore, User } from "../../../../models";
import TatugaClassLayout from "../../../../layouts/tatugaClassLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetUserCookieService } from "../../../../services/user";
import { GetOneClassroomService } from "../../../../services/classroom";
import { GetAllStudentsService } from "../../../../services/students";
import { GetAllScoresClassroomService } from "../../../../services/scores";
import {
  GetAllGroupService,
  GetGroupService,
} from "../../../../services/group";
import Loading from "../../../../components/loadings/loading";
import ClassroomLayout from "../../../../layouts/classroomLayout";
import { set } from "sanity";

function Index({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [triggerUpdateStudent, setTriggerUpdateStudent] = useState(false);
  const [selectStudent, setSelectStudent] = useState<StudentWithScore>();
  const [skeletion, setSkeletion] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [classroomGroupActive, setClassroomGroupActive] = useState<
    number | null
  >(null);
  const [checkboxStudents, setCheckboxStudents] =
    useState<(StudentWithScore & { checkbox: boolean })[]>();
  const [selectGroupId, setSelectGroupId] = useState<string | null>(null);
  const [
    triggerConfirmUpdateScoreMultiple,
    setTriggerConfirmUpdateScoreMultiple,
  ] = useState(false);
  const [triggerUpdateClassroomScore, setTriggerUpdateTriggerClassroom] =
    useState(false);

  const classroom = useQuery({
    queryKey: ["classroom", router.query.classroomId as string],
    queryFn: () =>
      GetOneClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const students = useQuery({
    queryKey: ["students", router.query.classroomId as string],
    queryFn: () =>
      GetAllStudentsService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const scores = useQuery({
    queryKey: ["scores", router.query.classroomId as string],
    queryFn: () =>
      GetAllScoresClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const groups = useQuery({
    queryKey: ["classroom-groups", router.query.classroomId as string],
    queryFn: () =>
      GetAllGroupService({ classroomId: router.query.classroomId as string }),
  });

  const oneGroup = useQuery({
    queryKey: ["group", selectGroupId],
    queryFn: () => GetGroupService({ groupId: selectGroupId as string }),
  });

  const handleTriggerUpdateClassroomScore = () => {
    setTriggerUpdateTriggerClassroom((prev) => !prev);
  };

  useEffect(() => {
    setCheckboxStudents(() => {
      return students?.data?.map((student) => {
        return {
          ...student,
          checkbox: false,
        };
      });
    });
  }, [students.data]);

  //style animationLottie
  const style = {
    height: 280,
  };

  return (
    <div className="w-full pb-96 bg-slate-100 ">
      {triggerUpdateClassroomScore && (
        <SelectStudentMultipleScoreUpdate
          setTriggerUpdateTriggerClassroom={setTriggerUpdateTriggerClassroom}
          setCheckboxStudents={setCheckboxStudents}
          setTriggerConfirmUpdateScoreMultiple={
            setTriggerConfirmUpdateScoreMultiple
          }
        />
      )}

      {triggerUpdateStudent && (
        <UpdateScore
          user={user}
          student={selectStudent as StudentWithScore}
          scores={scores}
          students={students}
          setTriggerUpdateStudent={setTriggerUpdateStudent}
        />
      )}

      {triggerConfirmUpdateScoreMultiple && (
        <UpdateScoreMultiple
          scores={scores}
          students={students}
          checkboxStudents={checkboxStudents}
          setTriggerConfirmUpdateScoreMultiple={
            setTriggerConfirmUpdateScoreMultiple
          }
        />
      )}

      <ClassroomLayout
        groups={groups}
        sideMenus={
          user.language === "Thai"
            ? SideMenusThai({ router })
            : sideMenusEnglish({ router })
        }
      >
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta charSet="UTF-8" />
          <title>{`classroom - ${classroom.data?.title}`}</title>
        </Head>

        <div className="flex  items-center justify-center ">
          <div className="w-full flex flex-col items-center justify-center  bg gap-10 h-full pb-40">
            {/* header section */}

            {/* main part */}
            <main className="w-full max-w-7xl h-full flex flex-col items-center justify-start  ">
              <div className="font-Poppins hidden font-semibold text-lg md:flex flex-col justify-center items-center text-black gap-2">
                <span>{user.language === "Thai" && "แสดงผลการจัดกลุ่ม"}</span>
                <div className="flex gap-5">
                  <button
                    onClick={() => {
                      setClassroomGroupActive(() => null);
                      setSelectGroupId(() => null);
                    }}
                    className={`w-28  ring-2 p-2  rounded-lg hover:bg-orange-400 hover:ring-black hover:text-white hover:drop-shadow-lg
               truncate transition duration-150 ${
                 classroomGroupActive === null
                   ? "bg-orange-500 text-white"
                   : "bg-white text-black"
               } ease-out`}
                  >
                    <span>ห้องเรียน</span>
                  </button>
                  {groups?.data?.map((group, index) => {
                    return (
                      <button
                        key={group.id}
                        onClick={() => {
                          if (classroomGroupActive !== index) {
                            setClassroomGroupActive(() => index);
                            setSelectGroupId(() => group.id);
                          }
                        }}
                        className={`w-max ring-2 p-2 flex items-center justify-center   rounded-lg hover:bg-orange-600 hover:ring-black hover:text-white hover:drop-shadow-lg
               truncate transition duration-150 ease-out ${
                 classroomGroupActive === index
                   ? "bg-orange-500 text-white"
                   : "bg-white text-black"
               } `}
                      >
                        {oneGroup.isFetching &&
                        classroomGroupActive === index ? (
                          <Loading />
                        ) : (
                          <span>{group.title}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectGroupId && (
                <DisplayGroup
                  scores={scores}
                  user={user}
                  students={students}
                  group={oneGroup}
                  groups={groups}
                  setClassroomGroupActive={setClassroomGroupActive}
                  setSelectGroupId={setSelectGroupId}
                />
              )}

              {/*
              students' avatar are here */}
              {classroomGroupActive === null && (
                <div
                  className="  md:w-11/12 lg:w-10/12 xl:w-11/12 max-w-7xl grid
                   grid-cols-2 gap-4 items-center justify-center md:justify-start lg:gap-10
              md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5 mt-10 place-items-center	"
                >
                  <button onClick={handleTriggerUpdateClassroomScore}>
                    <Trophy />
                  </button>

                  {students.isLoading
                    ? skeletion.map((number) => {
                        return (
                          <Skeleton
                            key={number}
                            width="100%"
                            height={200}
                            variant="rounded"
                          ></Skeleton>
                        );
                      })
                    : checkboxStudents?.map((student) => {
                        const shortName = student.firstName.replace(
                          /^(นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.)(.*)$/,
                          "$2"
                        );
                        const firstName = shortName.split(" ")[0];
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              if (triggerUpdateClassroomScore === false) {
                                setSelectStudent(() => student);
                                setTriggerUpdateStudent(() => true);
                                document.body.style.overflow = "hidden";
                              } else {
                                setCheckboxStudents((prev) => {
                                  const newMap = prev?.map((prevStudent) => {
                                    if (prevStudent.id === student.id) {
                                      return {
                                        ...prevStudent,
                                        checkbox: !prevStudent.checkbox,
                                      };
                                    } else {
                                      return { ...prevStudent };
                                    }
                                  });
                                  return newMap;
                                });
                              }
                            }}
                          >
                            <div
                              className="w-40 overflow-hidden rounded-3xl hover:drop-shadow-xl hover:scale-105 transition duration-150
                            flex relative justify-center ring-2 ring-black "
                            >
                              {triggerUpdateClassroomScore && (
                                <input
                                  type="checkbox"
                                  checked={student.checkbox}
                                  className="w-5 h-5  absolute top-3 right-3"
                                />
                              )}
                              <div
                                className={`w-14 h-10 rounded-r-full absolute left-0  top-4  ${
                                  student.score.totalPoints < 0
                                    ? "bg-red-600"
                                    : "bg-[#EDBA02] "
                                } ring-2 ring-white
  flex justify-center items-center font-sans font-bold text-xl z-10 text-white`}
                              >
                                {student.score.totalPoints}
                              </div>
                              {student.nationality &&
                                student.nationality !== "null" && (
                                  <div
                                    className={`w-max h-5 px-2 py-1 rounded-r-full absolute left-0  top-16 bg-blue-500  ring-2 ring-white
  flex justify-center items-center font-sans font-medium text-[0.5rem] z-10 text-white`}
                                  >
                                    {student.nationality}
                                  </div>
                                )}
                              <div
                                className="w-40 h-52 cursor-pointer  flex-col items-center justify-start flex
  duration-200  bg-white  overflow-hidden  hover:bg-orange-100 transition "
                              >
                                <div className="w-24 h-24 ring-2 ring-gray-200 relative overflow-hidden rounded-full mt-2 ">
                                  {students.isFetching && !router.isReady ? (
                                    <Skeleton
                                      variant="circular"
                                      width={96}
                                      height={96}
                                    />
                                  ) : (
                                    <Image
                                      src={student.picture}
                                      fill
                                      quality={60}
                                      sizes="(max-width: 500px) 100vw, 700px"
                                      placeholder="blur"
                                      blurDataURL={blurDataURL}
                                      alt="student's avatar"
                                      className=" hover:scale-150 object-cover
               transition duration-150 "
                                    />
                                  )}
                                </div>

                                <div className="font-Kanit text-xl flex items-center flex-col mt-2 justify-start gap-1">
                                  <div
                                    className="w-full truncate font-medium lg:text-xl flex-col
        flex justify-center items-center"
                                  >
                                    <span className="text-xl text-blue-700   ">
                                      {firstName}
                                    </span>
                                    <span className="text-sm text-gray-600 font-normal ">
                                      {student?.lastName}
                                    </span>
                                  </div>
                                  <div
                                    className="text-gray-700 font-normal  w-full h-5 flex
         items-center justify-center text-base  rounded-md"
                                  >
                                    {user.language === "Thai" && "เลขที่"}
                                    {user.language === "English" &&
                                      "number"}{" "}
                                    {student.number}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                </div>
              )}
            </main>
          </div>
        </div>
      </ClassroomLayout>
    </div>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
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
