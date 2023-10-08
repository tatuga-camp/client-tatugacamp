import React from 'react';

function CheckAttendanceByQrCode({ setTriggerAttendanceQrCode }) {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 m-auto z-50 flex items-center justify-center">
      <main className="w-96 h-96 bg-white"></main>
      <footer
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerAttendanceQrCode(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default CheckAttendanceByQrCode;
