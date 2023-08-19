import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BiChevronsLeft } from 'react-icons/bi';
import { FcCancel } from 'react-icons/fc';
import Swal from 'sweetalert2';
import Loading from '../loading/loading';
import { SummitWorkWithWorkSheet } from '../../service/student/assignment';
import { Skeleton } from '@mui/material';

function CreateStudentWork({
  body,
  setTriggerCreateStudentWork,
  fetchStudentWork,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assignmentBody, setAssignmentBody] = useState(body);
  const [loadingTiny, setLoadingTiny] = useState(false);
  useEffect(() => {
    setAssignmentBody(() => body);
  }, [body]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        setTriggerCreateStudentWork(() => false);
        window.history.pushState(null, '', router.asPath);
        return false;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // Add any state variables to dependencies array if needed.

  const handleSummitWork = async (e) => {
    try {
      e.preventDefault();
      setLoading(() => true);
      const studentWorkSheetCreate = await SummitWorkWithWorkSheet({
        body: assignmentBody,
        assignmentId: router.query.assignmentId,
        studentId: router.query.studentId,
      });
      fetchStudentWork.refetch();
      setLoading(() => false);
      setTriggerCreateStudentWork(() => false);

      Swal.fire('success', 'summit work successfully', 'success');
    } catch (err) {
      setLoading(() => false);
      if (
        err?.props?.response?.data?.message ===
        "student's already summit their work"
      ) {
        Swal.fire(
          'error',
          'นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม',
          'error',
        );
      } else {
        Swal.fire('error', err?.props?.response?.message, 'error');
      }
      console.log(err);
    }
  };

  return (
    <div className="w-screen fixed z-50 flex flex-col justify-start items-center h-screen bg-white">
      <div className="w-full justify-start items-center py-1 flex">
        <button
          onClick={() => {
            setTriggerCreateStudentWork(() => false);
          }}
          className="flex items-center justify-center gap-3 px-2 w-max m-2 h-8 bg-blue-500 rounded-xl drop-shadow-md text-white text-3xl"
        >
          <span className="text-sm uppercase">go back</span>
          <BiChevronsLeft />
        </button>
      </div>
      <div className="h-5/6 w-full md:w-11/12 ">
        {loadingTiny ? (
          <Skeleton width="100%" height="100%" />
        ) : fetchStudentWork?.data?.status === 'no-work' ||
          !fetchStudentWork?.data?.data?.body ? (
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
            textareaName="body"
            init={{
              link_context_toolbar: true,
              setup: function (editor) {
                editor.on('init', function () {
                  setLoadingTiny(() => false);
                });
              },
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
        ) : (
          <Editor
            disabled={true}
            apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
            init={{
              setup: function (editor) {
                editor.on('init', function () {
                  setLoadingTiny(() => false);
                });
              },
              height: '100%',
              width: '100%',
              menubar: false,
              toolbar: false,
              selector: 'textarea', // change this value according to your HTML
            }}
            initialValue={fetchStudentWork.data.data.body}
            value={fetchStudentWork.data.data.body}
          />
        )}
      </div>
      {fetchStudentWork?.data?.data?.status !== 'no-work' ? (
        <div className="px-5 mt-2 py-2 flex justify-center items-center gap-4 rounded-lg bg-gray-600 text-gray-200 font-semibold ">
          คุณส่งงานแล้ว
          <div>
            <AiOutlineSend />
          </div>
        </div>
      ) : loading ? (
        <div className="mt-2">
          <Loading />
        </div>
      ) : (
        <button
          onClick={handleSummitWork}
          className="px-5 mt-2 py-2 flex justify-center items-center gap-4 rounded-lg bg-green-600 text-green-200 font-semibold "
        >
          ส่งงาน
          <div>
            <AiOutlineSend />
          </div>
        </button>
      )}
    </div>
  );
}

export default CreateStudentWork;
