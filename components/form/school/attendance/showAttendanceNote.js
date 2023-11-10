import { Editor } from '@tinymce/tinymce-react';
import React from 'react';

function ShowAttendanceNote({ setTriggerShowNote, selectNote }) {
  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ-0 z-50 font-Kanit">
      <div
        className="w-10/12 h-5/6 fixed z-40 top-0 bottom-0 right-0
       left-0 m-auto flex flex-col  items-center justify-center md:justify-start gap-2 bg-white p-0 md:p-5 rounded-lg  "
      >
        <Editor
          disabled={true}
          apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
          init={{
            height: '100%',
            width: '100%',
            menubar: false,
            toolbar: false,
            selector: 'textarea', // change this value according to your HTML
          }}
          initialValue={selectNote}
          value={selectNote}
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

export default ShowAttendanceNote;
