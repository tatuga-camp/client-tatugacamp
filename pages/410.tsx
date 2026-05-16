import Head from "next/head";
import Link from "next/link";

export default function Gone() {
  return (
    <>
      <Head>
        <title>หน้านี้ถูกย้าย — Tatuga School</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center font-Kanit">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">
          หน้านี้ถูกย้ายไปแล้ว
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl">
          ระบบ Tatuga Class ปิดให้บริการ และย้ายไปอยู่ที่ Tatuga School
          พร้อมฟีเจอร์ที่ดียิ่งขึ้น
        </p>
        <Link
          href="https://tatugaschool.com/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full no-underline"
        >
          ไปที่ tatugaschool.com
        </Link>
      </main>
    </>
  );
}
