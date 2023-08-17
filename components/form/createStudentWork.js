import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { FcCancel } from 'react-icons/fc';

function CreateStudentWork({ body, setTriggerCreateStudentWork }) {
  const router = useRouter();
  const [assignmentBody, setAssignmentBody] = useState(body);
  useEffect(() => {
    setAssignmentBody(() => body);
  }, [body]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        setTriggerCreateStudentWork(() => false);
      }
      return false;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // Add any state variables to dependencies array if needed.
  return (
    <div className="w-screen fixed z-50 flex flex-col justify-start items-center h-screen bg-white">
      <div className="w-full justify-start items-center h-10 flex">
        <button
          onClick={() => {
            setTriggerCreateStudentWork(() => false);
          }}
          className="w-7 h-7 ml-2 hover:bg-red-300 hover:scale-110 transition duration-100
          bg-red-100 rounded-full text-lg flex items-center justify-center "
        >
          <FcCancel />
        </button>
      </div>
      <div className="h-5/6 w-full md:w-11/12 ">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
          textareaName="body"
          init={{
            link_context_toolbar: true,
            height: '100%',
            width: '100%',
            toolbar_location: 'top',
            menubar: true,
            paste_data_images: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | formatselect | blocks | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | link ',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          }}
          value={assignmentBody}
          onEditorChange={(newText) => {
            setAssignmentBody(() => newText);
          }}
        />
      </div>
      <button className="px-5 mt-2 py-2 flex justify-center items-center gap-4 rounded-lg bg-green-600 text-green-200 font-semibold ">
        ส่งงาน
        <div>
          <AiOutlineSend />
        </div>
      </button>
    </div>
  );
}

export default CreateStudentWork;
