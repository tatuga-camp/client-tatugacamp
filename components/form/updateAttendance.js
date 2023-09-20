import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DeleteNote, UpdateAttendnaceAPI } from '../../service/attendance';
import { AiFillDelete, AiOutlineCloseCircle } from 'react-icons/ai';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '../loading/loading';
const checkList = [
  {
    titleThai: 'เข้าเรียน',
    titleEnglish: 'Present',
    bgColor: 'bg-green-500',
  },
  {
    titleThai: 'ลา',
    titleEnglish: 'Take a leave',
    bgColor: 'bg-yellow-500',
  },
  {
    titleThai: 'ป่วย',
    titleEnglish: 'sick',
    bgColor: 'bg-blue-500',
  },
  {
    titleThai: 'ขาด',
    titleEnglish: 'Absent',
    bgColor: 'bg-red-500',
  },
  {
    titleThai: 'สาย',
    titleEnglish: 'late',
    bgColor: 'bg-orange-500',
  },
  {
    titleThai: 'เฝ้าระวัง',
    titleEnglish: 'warn',
    bgColor: 'bg-red-700',
  },
];

function UpdateAttendance({
  setTriggerUpdateAttendance,
  student,
  attendanceData,
  attendances,
  language,
  user,
}) {
  const [activeAttendance, setActiveAttendance] = useState();
  const [note, setNote] = useState({
    body: '',
  });

  const [loading, setLoading] = useState(false);
  const [reCheck, setReCheck] = useState();
  const date = new Date(attendanceData?.date);
  const formattedDate = date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    if (attendanceData?.present) {
      setActiveAttendance(0);
    }
    if (attendanceData?.holiday) {
      setActiveAttendance(1);
    }
    if (attendanceData?.sick) {
      setActiveAttendance(2);
    }
    if (attendanceData?.absent) {
      setActiveAttendance(3);
    }
    if (attendanceData?.late) {
      setActiveAttendance(4);
    }
    if (attendanceData?.warn) {
      setActiveAttendance(5);
    }
    setReCheck(() => {
      return {
        absent: attendanceData?.absent,
        present: attendanceData?.present,
        holiday: attendanceData?.holiday,
        late: attendanceData?.late,
        sick: attendanceData?.sick,
        warn: attendanceData?.warn,
      };
    });
  }, []);

  const handleEditorChange = (content, editor) => {
    setNote((prev) => {
      return {
        ...prev,
        body: content,
      };
    });
  };

  const handleUpdateAttendance = async () => {
    try {
      setLoading(() => true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(note.body, 'text/html');
      const imageElements = doc.getElementsByTagName('img');
      const imageUrls = Array.from(imageElements).map((img) => img.src);
      const update = await UpdateAttendnaceAPI({
        attendanceId: attendanceData.id,
        studentId: student.id,
        absent: reCheck.absent,
        present: reCheck.present,
        holiday: reCheck.holiday,
        sick: reCheck.sick,
        late: reCheck.late,
        warn: reCheck.warn,
        imagesBase64: imageUrls,
        note: note.body,
      });
      setLoading(() => false);
      attendances.refetch();
      Swal.fire('success', 'attendance has been updated', 'success');
      document.body.style.overflow = 'auto';
      setTriggerUpdateAttendance(() => false);
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      document.body.style.overflow = 'auto';
    }
  };
  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-40 font-Kanit">
      <div
        className="w-full h-full md:w-max md:h-max fixed z-40 top-0 bottom-0 right-0
       left-0 m-auto flex flex-col  items-center justify-center md:justify-start gap-2 bg-white p-0 md:p-5 rounded-lg  "
      >
        <div className="w-full block md:hidden">
          <button
            onClick={() => {
              setTriggerUpdateAttendance(() => false);
              document.body.style.overflow = 'auto';
            }}
            className="ml-3 text-2xl flex justify-center items-center"
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
        <div
          className={`w-20 h-20 ${checkList[activeAttendance]?.bgColor} rounded-full relative`}
        >
          <Image
            src={student?.picture}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw"
          />
        </div>
        <div className="font-Kanit flex gap-3">
          <span>{student?.number}</span>
          <span>
            {student?.firstName} {student?.lastName}
          </span>
        </div>
        <div className="w-full h-max gap-2  flex flex-col items-center justify-start">
          <div className="w-full flex items-end gap-2 flex-col h-80 md:w-[30rem] md:h-80 relative">
            {attendanceData?.note &&
              (loading ? (
                <Loading />
              ) : (
                <button
                  onClick={async () => {
                    setLoading(() => true);
                    await DeleteNote({ attendanceId: attendanceData.id });
                    attendances.refetch();
                    setLoading(() => false);
                    document.body.style.overflow = 'auto';
                    setTriggerUpdateAttendance(() => false);
                  }}
                  className="flex gap-2 hover:bg-red-500 hover:text-red-200 transition duration-100  justify-center rounded-lg 
               items-center w-max p-2 bg-red-200 text-red-500"
                >
                  <AiFillDelete />
                  delete note
                </button>
              ))}
            {attendanceData?.note ? (
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
                initialValue={attendanceData?.note}
                value={attendanceData?.note}
              />
            ) : (
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                textareaName="note"
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
                        const blobCache =
                          tinymce.activeEditor.editorUpload.blobCache;
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
            )}
          </div>

          <div className="flex  flex-col items-center">
            <span>{formattedDate}</span>
            <div className="w-80 h-[1px] bg-blue-500"></div>
          </div>
          <div className="grid items-center w-10/12 md:w-full h-max grid-cols-3 place-items-center my-2">
            {checkList.map((attendance, index) => {
              return (
                <div
                  onClick={() => {
                    setReCheck(() => {
                      if (index === 0) {
                        return {
                          absent: false,
                          present: true,
                          holiday: false,
                          sick: false,
                          late: false,
                          warn: false,
                        };
                      } else if (index === 1) {
                        return {
                          absent: false,
                          present: false,
                          holiday: true,
                          sick: false,
                          late: false,
                          warn: false,
                        };
                      } else if (index === 2) {
                        return {
                          absent: false,
                          present: false,
                          holiday: false,
                          sick: true,
                          late: false,
                          warn: false,
                        };
                      } else if (index === 3) {
                        return {
                          absent: true,
                          present: false,
                          holiday: false,
                          sick: false,
                          late: false,
                          warn: false,
                        };
                      } else if (index === 4) {
                        return {
                          absent: false,
                          present: false,
                          holiday: false,
                          sick: false,
                          late: true,
                          warn: false,
                        };
                      } else if (index === 5) {
                        return {
                          absent: false,
                          present: false,
                          holiday: false,
                          sick: false,
                          late: false,
                          warn: true,
                        };
                      }
                    });
                    setActiveAttendance(index);
                  }}
                  key={index}
                  className={`
                  ${
                    user?.schoolUser?.organization !== 'immigration' &&
                    index === 5 &&
                    'hidden'
                  }
                  ${attendance.bgColor}
                  w-max min-w-[5rem] h-8 text-center flex items-center justify-center text-white rounded-lg cursor-pointer 
                  border-2 border-solid hover:scale-105 transition duration-150 ${
                    activeAttendance === index ? 'border-black' : 'border-white'
                  }
                  
                  `}
                >
                  {language === 'Thai' && attendance.titleThai}
                  {language === 'English' && attendance.titleEnglish}
                </div>
              );
            })}
          </div>
          <div className="w-full flex items-center justify-center">
            {loading ? (
              <Loading />
            ) : (
              <button
                onClick={handleUpdateAttendance}
                className="bg-blue-400 w-28 h-10 flex items-center cursor-pointer text-white
          justify-center hover:scale-110 transition duration-150 rounded-xl drop-shadow-lg"
              >
                {language === 'Thai' && 'แก้ไข'}
                {language === 'English' && 'Update'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerUpdateAttendance(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default UpdateAttendance;
