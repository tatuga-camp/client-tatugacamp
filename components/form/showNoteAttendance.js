import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { UpdateHeadAttendance } from '../../service/attendance';

function ShowNoteAttendance({
  setTriggerShowNote,
  selectNote,
  attendances,
  classroomId,
}) {
  const [note, setNote] = useState({
    id: selectNote?.headAttendance?.id,
    body: selectNote?.headAttendance?.note,
    groupId: selectNote?.groupId,
  });
  const handleEditorChange = (content, editor) => {
    setNote((prev) => {
      return {
        ...prev,
        body: content,
      };
    });
  };

  const handleSummitUpdate = async () => {
    try {
      Swal.fire({
        title: 'กำลังโหลด...',
        html: 'รอสักครู่นะครับ...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(note.body, 'text/html');
      const imageElements = doc.getElementsByTagName('img');
      const imageUrls = Array.from(imageElements)
        .map((img) => {
          const src = img.src;
          if (src.startsWith('data:image')) {
            // Check if the src attribute starts with "data:image" (base64 image)
            return src;
          } else {
            return null; // Skip images with actual URLs
          }
        })
        .filter(Boolean); // Filter out null values (i.e., actual URLs)

      await UpdateHeadAttendance({
        imagesBase64: imageUrls,
        note: note.body,
        headAttendanceId: note.id,
        classroomId: classroomId,
        groupId: note.groupId,
      });
      await attendances.refetch();
      setTriggerShowNote(() => false);
      document.body.style.overflow = 'auto';
      Swal.fire('success', 'Note has been updated', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };
  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ-0 z-50 font-Kanit">
      <div
        className="w-10/12 h-5/6 fixed z-40 top-0 bottom-0 right-0
   left-0 m-auto flex flex-col  items-center justify-center md:justify-start gap-2 bg-white p-0 md:p-5 rounded-lg  "
      >
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
          textareaName="note"
          value={note.body}
          init={{
            selector: 'textarea',
            link_context_toolbar: true,
            height: '100%',
            width: '100%',
            menubar: true,
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_types: 'image',
            file_picker_callback: (cb, value, meta) => {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              input.addEventListener('change', (e) => {
                const file = e.target.files[0];

                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  /*
                          Note: Now we need to register the blob in TinyMCEs image blob
                          registry. In the next release this part hopefully won't be
                          necessary, as we are looking to handle it internally.
                        */
                  const id = 'blobid' + new Date().getTime();
                  const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = reader.result.split(',')[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);

                  /* call the callback and populate the Title field with the file name */
                  cb(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              });

              input.click();
            },
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
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
              'link | image',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          onEditorChange={handleEditorChange}
        />
        <button
          onClick={handleSummitUpdate}
          className="w-max font-normal text-base px-10 hover:bg-blue-600 text-white hover:drop-shadow-sm transition duration-150
         bg-blue-500 rounded-full py-1"
        >
          update
        </button>
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
