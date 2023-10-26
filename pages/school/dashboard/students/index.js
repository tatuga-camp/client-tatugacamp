import { parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react';
import { GetUserCookie } from '../../../../service/user';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../../../data/school/menubarsHomepage';
import { useRouter } from 'next/router';
import Layout from '../../../../layouts/tatugaSchoolLayOut';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SiGoogleclassroom } from 'react-icons/si';
import { InputAdornment, TextField } from '@mui/material';
import { IoSearchCircleOutline } from 'react-icons/io5';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { GetAllStudentClassService } from '../../../../service/school/class-student';
import CreateStudentClass from '../../../../components/form/school/student-class/createStudentClass';
import ShowStudentClass from '../../../../components/form/school/student-class/showStudentClass';

function Index({ user }) {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [triggerCreateClassStudent, setTriggerCreateClassStudent] =
    useState(false);
  const [triggerShowClassStudent, setTriggerShowClassStudent] = useState(false);
  const [selectStudentClass, setSelectStudentClass] = useState();
  const studentClasses = useInfiniteQuery(
    ['student-classes'],
    ({ pageParam }) => {
      return GetAllStudentClassService({
        nextId: pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    },
  );

  useEffect(() => {
    if (inView) {
      studentClasses.fetchNextPage();
    }
  }, [inView]);

  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai;
    } else if (user?.language === 'English') {
      return sideMenusEnglish;
    }
  });

  return (
    <div className="font-Kanit bg-slate-50 ">
      <Layout sideMenus={sideMenus} user={user} router={router}></Layout>
      {triggerCreateClassStudent && (
        <CreateStudentClass
          studentClasses={studentClasses}
          setTriggerCreateClassStudent={setTriggerCreateClassStudent}
        />
      )}
      {triggerShowClassStudent && (
        <ShowStudentClass
          studentClasses={studentClasses}
          setTriggerShowClassStudent={setTriggerShowClassStudent}
          selectStudentClass={selectStudentClass}
        />
      )}
      <div className="flex flex-col gap-5 pt-2 justify-start pb-20 items-center">
        <section className="w-full border-b-2 pb-5 border-slate-200 items-center flex gap-5 justify-center">
          <button
            onClick={() => {
              document.body.style.overflow = 'hidden';
              setTriggerCreateClassStudent(() => true);
            }}
            className="flex gap-3 hover:scale-110 transition duration-100
         drop-shadow-md bg-blue-400 group  justify-center items-center h-12  w-max p-10
         hover:bg-white ring-blue-400 ring-2 rounded-xl py-0"
          >
            <div className="flex justify-center items-center text-lg text-white group-hover:text-black">
              <SiGoogleclassroom />
            </div>
            <span className="group-hover:text-black text-white">
              สร้างชั้นเรียน
            </span>
          </button>
          <div className="w-96">
            <TextField
              label="ค้นหาชั้นเรียน"
              variant="filled"
              fullWidth
              color="info"
            />
          </div>
        </section>
        <h1 className="text-3xl font-semibold">ข้อมูลชั้นเรียน</h1>
        <table className="w-5/12 h-max overflow-auto  border-separate border-spacing-y-2">
          <thead>
            <tr className="w-full  text-left ring-2 ring-black h-10 rounded-md">
              <th className="pl-4 ">ระดับชั้น</th>
              <th>ปีการศึกษา</th>
              <th>เทอม</th>
              <th>สร้างเมื่อ</th>
            </tr>
          </thead>
          <tbody className="">
            {studentClasses?.data?.pages?.map((pages, index) => {
              return pages?.map((studentClass) => {
                const level = studentClass.level.replace(/^\d+-/, '');
                const yearDate = new Date(studentClass.year); // Replace with your date
                const year = yearDate.toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                });

                const createAtDate = new Date(studentClass.createAt); // Replace with your date
                const createAt = createAtDate.toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: 'numeric',
                });
                return (
                  <tr
                    onClick={() => {
                      document.body.style.overflow = 'hidden';
                      setSelectStudentClass(() => studentClass);
                      setTriggerShowClassStudent(() => true);
                    }}
                    key={studentClass.id}
                    className="w-full text-lg hover:scale-105 transition duration-75 hover:bg-stone-200 cursor-pointer  h-14 bg-stone-50  overflow-hidden  text-left"
                  >
                    <td className="pl-4">
                      {level} / {studentClass.class}
                    </td>
                    <td>{year}</td>
                    <td>{studentClass.term}</td>
                    <td>{createAt}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
        <button
          className="px-10 ring-2 ring-black rounded-full"
          ref={ref}
          onClick={() => studentClasses.fetchNextPage()}
          disabled={
            !studentClasses.hasNextPage || studentClasses.isFetchingNextPage
          }
        >
          {studentClasses.isFetchingNextPage
            ? 'Loading more...'
            : studentClasses.hasNextPage
            ? 'Load Newer'
            : 'Nothing more to load'}
        </button>
      </div>
    </div>
  );
}

export default Index;
export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/signIn',
      },
    };
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;

      if (user.role !== 'SCHOOL') {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: 'schoolUserOnly',
            },
          },
        };
      } else if (user.role === 'SCHOOL') {
        if (user?.schoolUser?.organization === 'school') {
          return {
            props: {
              user,
            },
          };
        } else if (user?.schoolUser?.organization === 'immigration') {
          return {
            redirect: {
              permanent: false,
              destination: '/school/dashboard-immigration',
            },
          };
        }
      }
    } catch (err) {
      console.log(err);
      return {
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
        },
      };
    }
  }
}
