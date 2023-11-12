import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetOneClassroom } from '../../../../service/classroom';
import Head from 'next/head';
import FullScreenLoading from '../../../../components/loading/FullScreenLoading';
import { Popover } from '@headlessui/react';
import Layout from '../../../../layouts/classroomLayout';
import { GetAllStudents } from '../../../../service/students';
import Image from 'next/image';
import { GetAllScoresClassroom } from '../../../../service/scores';
import UpdateScore from '../../../../components/form/updateScore';
import { GetUserCookie } from '../../../../service/user';
import { Skeleton } from '@mui/material';
import Unauthorized from '../../../../components/error/unauthorized';
import { parseCookies } from 'nookies';
import {
  SideMenusThai,
  sideMenusEnglish,
} from '../../../../data/menubarsClassroom';
import Trophy from '../../../../components/svg/Trophy';
import { GetAllGroup, GetGroup } from '../../../../service/group';
import DisplayGroup from '../../../../components/group/displayGroup';
import Loading from '../../../../components/loading/loading';
import { GetAllStudentsInClassroomForTeacherService } from '../../../../service/teacher/student';
import SelectStudentMultipleScoreUpdate from '../../../../components/form/selectStudentMultipleScoreUpdate';
import UpdateScoreMultiple from '../../../../components/form/updateScoreMultiple';

function Index({ user, error }) {
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggerUpdateStudent, setTriggerUpdateStudent] = useState(false);
  const [selectStudent, setSelectStudent] = useState();
  const [skeletion, setSkeletion] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [classroomGroupActive, setClassroomGroupActive] = useState('default');
  const [checkboxStudents, setCheckboxStudents] = useState([]);
  const [
    triggerConfirmUpdateScoreMultiple,
    setTriggerConfirmUpdateScoreMultiple,
  ] = useState(false);
  const [triggerUpdateClassroomScore, setTriggerUpdateTriggerClassroom] =
    useState(false);
  const groupId = useRef();
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return SideMenusThai();
    } else if (user?.language === 'English') {
      return sideMenusEnglish();
    }
  });

  const classroom = useQuery(
    ['classroom'],
    () => GetOneClassroom({ params: router.query.classroomId }),
    { enabled: false },
  );
  const students = useQuery(
    ['students'],
    () =>
      user?.schoolUser?.organization === 'school'
        ? GetAllStudentsInClassroomForTeacherService({
            classroomId: router.query.classroomId,
          })
        : GetAllStudents({ classroomId: router.query.classroomId }),
    { enabled: false },
  );
  const scores = useQuery(
    ['scores'],
    () => GetAllScoresClassroom({ classroomId: router.query.classroomId }),
    { enabled: false },
  );
  const groups = useQuery(
    ['classroom-groups'],
    () => GetAllGroup({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );

  const groupQuery = useQuery(
    ['group'],
    () => GetGroup({ groupId: groupId.current }),
    {
      enabled: false,
    },
  );

  // Update sideMenus whenever the user's language changes
  useEffect(() => {
    if (router.isReady) {
      classroom.refetch();
      students.refetch();
      scores.refetch();
      groups.refetch();
      if (user?.language === 'Thai') {
        setSideMenus(SideMenusThai(router));
      } else if (user?.language === 'English') {
        setSideMenus(sideMenusEnglish(router));
      }
    }
  }, [router.isReady]);

  const handleTriggerUpdateClassroomScore = () => {
    setTriggerUpdateTriggerClassroom((prev) => !prev);
  };

  useEffect(() => {
    setCheckboxStudents(() => {
      return students?.data?.data?.map((student) => {
        return {
          ...student,
          checkbox: false,
        };
      });
    });
  }, [students.data]);
  if (!router.isReady) {
    return <FullScreenLoading />;
  }
  if (classroom?.data?.response?.data.statusCode === 400) {
    return (
      <div className="flex w-full h-screen justify-center items-center font-sans">
        <h1>404 - Page Not Found😢</h1>
      </div>
    );
  }
  //style animationLottie
  const style = {
    height: 280,
  };

  const handleLoadingComplete = (id) => {
    setLoadedImages((prevImages) => [...prevImages, id]);
  };

  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="w-full pb-96 bg-slate-100 ">
      <Layout
        language={user.language}
        checkUser={user}
        sideMenus={sideMenus}
        groups={groups}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>{`classroom - ${classroom.data?.data?.title}`}</title>
      </Head>

      <div className="flex  items-center justify-center ">
        <div className="w-full flex flex-col items-center justify-center  bg gap-10 h-full pb-40">
          {/* header section */}

          {/* main part */}
          <main className="w-full max-w-7xl h-full flex flex-col items-center justify-start  ">
            <div className="font-Poppins hidden font-semibold text-lg md:flex flex-col justify-center items-center text-black gap-2">
              <span>{user.language === 'Thai' && 'แสดงผลการจัดกลุ่ม'}</span>
              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setClassroomGroupActive(() => 'default');
                    groupId.current = '';
                  }}
                  className={`w-28  ring-2 p-2  rounded-lg hover:bg-orange-400 hover:ring-black hover:text-white hover:drop-shadow-lg
               truncate transition duration-150 ${
                 classroomGroupActive === 'default'
                   ? 'bg-orange-500 text-white'
                   : 'bg-white text-black'
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
                          groupId.current = group.id;
                          groupQuery.refetch();
                        }
                      }}
                      className={`w-max ring-2 p-2 flex items-center justify-center   rounded-lg hover:bg-orange-600 hover:ring-black hover:text-white hover:drop-shadow-lg
               truncate transition duration-150 ease-out ${
                 classroomGroupActive === index
                   ? 'bg-orange-500 text-white'
                   : 'bg-white text-black'
               } `}
                    >
                      {groupQuery.isFetching &&
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
            {groupId.current && (
              <DisplayGroup
                scores={scores}
                user={user}
                students={students}
                group={groupQuery}
                groups={groups}
                setClassroomGroupActive={setClassroomGroupActive}
                groupId={groupId}
              />
            )}
            {/*
              students' avatar are here */}
            {classroomGroupActive === 'default' && (
              <div
                className=" md:w-11/12 lg:w-10/12 xl:w-11/12 max-w-7xl grid grid-cols-2 gap-4 items-center justify-center md:justify-start
              md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5 mt-10 place-items-center	"
              >
                <button onClick={handleTriggerUpdateClassroomScore}>
                  <Trophy />
                </button>

                {triggerUpdateClassroomScore && (
                  <SelectStudentMultipleScoreUpdate
                    setTriggerUpdateTriggerClassroom={
                      setTriggerUpdateTriggerClassroom
                    }
                    setCheckboxStudents={setCheckboxStudents}
                    setTriggerConfirmUpdateScoreMultiple={
                      setTriggerConfirmUpdateScoreMultiple
                    }
                  />
                )}

                {triggerUpdateStudent && (
                  <UpdateScore
                    user={user}
                    language={user.language}
                    student={selectStudent}
                    scores={scores.data}
                    students={students}
                    setTriggerUpdateStudent={setTriggerUpdateStudent}
                    refetchScores={scores.refetch}
                  />
                )}

                {triggerConfirmUpdateScoreMultiple && (
                  <UpdateScoreMultiple
                    scores={scores.data}
                    students={students}
                    checkboxStudents={checkboxStudents}
                    setTriggerConfirmUpdateScoreMultiple={
                      setTriggerConfirmUpdateScoreMultiple
                    }
                  />
                )}

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
                        '$2',
                      );
                      const firstName = shortName.split(' ')[0];
                      return (
                        <button
                          key={student.id}
                          onClick={() => {
                            if (triggerUpdateClassroomScore === false) {
                              setSelectStudent(() => student);
                              setTriggerUpdateStudent(() => true);
                              document.body.style.overflow = 'hidden';
                            } else {
                              setCheckboxStudents((prev) => {
                                const newMap = prev?.map((check) => {
                                  if (check.id === student.id) {
                                    return {
                                      ...check,
                                      checkbox: !check.checkbox,
                                    };
                                  } else if (check.id !== student.id) {
                                    return { ...check };
                                  }
                                });
                                return newMap;
                              });
                            }
                          }}
                        >
                          <div className="w-40 overflow-hidden rounded-3xl  flex relative justify-center drop-shadow-md">
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
                                  ? 'bg-red-600'
                                  : 'bg-[#EDBA02] '
                              } ring-2 ring-white
  flex justify-center items-center font-sans font-bold text-xl z-10 text-white`}
                            >
                              {student.score.totalPoints}
                            </div>
                            {student.nationality &&
                              student.nationality !== 'null' && (
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
                              {!loadedImages.includes(student.id) && (
                                <div>
                                  <Skeleton
                                    variant="circular"
                                    width={96}
                                    height={96}
                                  />
                                </div>
                              )}

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
                                    blurDataURL="data:image/png;base64,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"
                                    alt="student's avatar"
                                    className=" hover:scale-150 object-cover
               transition duration-150 "
                                    onLoad={() =>
                                      handleLoadingComplete(student.id)
                                    }
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
                                  {user.language === 'Thai' && 'เลขที่'}
                                  {user.language === 'English' && 'number'}{' '}
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
    </div>
  );
}

export default Index;
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/signIn',
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
        },
      };
    }
  }
}
