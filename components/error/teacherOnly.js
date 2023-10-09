import React from 'react';
import Layout from '../../layouts/tatugaSchoolLayOut';
import Head from 'next/head';
import { IoWarning } from 'react-icons/io5';
import { useRouter } from 'next/router';
import Link from 'next/link';

function TeacherOnly({ user }) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>SCHOOL USER ONLY</title>
      </Head>
      <div
        className={`w-screen font-Kanit h-screen flex  items-center justify-center
bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover flex-col `}
      >
        <div className="text-4xl text-red-400">
          <IoWarning />
        </div>
        <div className="text-xl md:text-3xl font-Kanit">
          {user.language === 'Thai'
            ? 'สำหรับบัญญชี ครู เท่านั้นถึงสามารถเข้าถึงได้'
            : user.language === 'English' && 'Only for teacher user!'}
        </div>
        <div>
          <span>
            {user.email}{' '}
            {user.language === 'Thai'
              ? 'ไม่มีสิทธิเข้าถึง'
              : user.language === 'English' && "Don't have any right to access"}
          </span>
        </div>

        <Link
          href={'/classroom'}
          className="w-max mt-5 bg-green-600 font-semibold text-lg px-5 py-2 rounded-lg text-white drop-shadow-lg
        hover:scale-110 transition duration-150 ease-in-out"
        >
          {user.language === 'Thai'
            ? 'ย้อนกลับ'
            : user.language === 'English' && 'BACK'}
        </Link>
      </div>
    </div>
  );
}

export default TeacherOnly;
