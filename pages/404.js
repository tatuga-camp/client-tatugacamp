import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

function Custom404() {
  const router = useRouter();
  //   useEffect(() => {
  //     router.push('/');
  //   }, []);
  return (
    <div className="w-screen h-screen bg-main-color gap-5 flex flex-col items-center justify-center relative font-Kanit text-3xl">
      <header>
        <div className="w-28 h-28 bg-white rounded-full drop-shadow-lg overflow-hidden relative">
          <Image src="/favicon.ico" fill className="object-cover" />
        </div>
      </header>
      <main className="flex flex-col w-max items-center justify-center bg-white p-5 px-8 rounded-lg drop-shadow-md">
        <section className="flex  flex-col items-center justify-center gap-2 w-max px-5 border-b-2 border-black pb-5">
          <h1>Page not found</h1>
          <h3 className="text-xl ">
            Please go back to homepage <Link href="/">Click</Link>{' '}
          </h3>
        </section>
        <section className="flex flex-col items-center justify-center gap-2 w-max px-5 mt-5">
          <h1>ไม่พบหน้าเพจ</h1>
          <h3 className="text-xl ">
            กรุณากลับสู่หน้าหลัก <Link href="/">คลิก</Link>
          </h3>
        </section>
      </main>
    </div>
  );
}

export default Custom404;
