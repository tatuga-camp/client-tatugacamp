import React from 'react';

function ShowNoteAttendance({ setTriggerShowNote, selectNote }) {
  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-40 font-Kanit">
      <div
        className="w-80 h-80 fixed z-40 top-0 bottom-0 right-0
   left-0 m-auto flex flex-col  items-center justify-center md:justify-start gap-2 bg-white p-0 md:p-5 rounded-lg  "
      >
        <div
          className="h-full w-full overflow-auto ml-2"
          dangerouslySetInnerHTML={{
            __html: selectNote,
          }}
        />
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerShowNote(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default ShowNoteAttendance;
