import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { FcDeleteRow } from 'react-icons/fc';
import Loading from '../loading/loading';
import { CreateGradeApi, GetAllGrade } from '../../service/grade';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';

function CreateGrade({ setTriggerCreateGrade, studentsScores }) {
  const router = useRouter();
  const grade = useQuery(
    ['grade'],
    () => GetAllGrade({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );

  //fetch grade
  useEffect(() => {
    if (router.isReady) {
      grade.refetch();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!grade.data) {
      setInputGradeRange(() => [
        { id: 1, title: '4', max: 100, min: 80 },
        { id: 2, title: '3.5', max: 79, min: 75 },
        { id: 3, title: '3', max: 74, min: 70 },
        { id: 4, title: '2.5', max: 69, min: 65 },
        { id: 5, title: '2', max: 64, min: 60 },
        { id: 6, title: '1.5', max: 59, min: 55 },
        { id: 7, title: '1', max: 54, min: 50 },
        { id: 8, title: '0', max: 49, min: 0 },
      ]);
    } else if (grade.data) {
      setInputGradeRange(() => {
        return grade.data.map((list) => {
          return {
            id: list.id,
            title: list.title,
            max: list.max,
            min: list.min,
          };
        });
      });
    }
  }, [grade.data]);
  const [loading, setLoading] = useState(false);
  const [inputGradeRange, setInputGradeRange] = useState();
  const handleDeleteGradeRange = (id) => {
    const updatedGradeRange = inputGradeRange.filter((item) => item.id !== id);
    setInputGradeRange(updatedGradeRange);
  };
  const handleChangeGradeRangeInput = ({ id, field, value }) => {
    setInputGradeRange((prevRanges) => {
      return prevRanges.map((range) => {
        if (range.id === id) {
          return { ...range, [field]: value };
        }
        return range;
      });
    });
  };

  const handleCreateGrade = async () => {
    try {
      setLoading(() => true);
      const grandeRanges = inputGradeRange.map((list) => {
        return { title: list.title, max: list.max, min: list.min };
      });
      const grade = await CreateGradeApi({
        classroomId: router.query.classroomId,
        grandeRanges,
      });
      studentsScores.refetch();
      Swal.fire('Success', 'create grade successfully', 'success');
      setLoading(() => false);
    } catch (err) {
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      setLoading(() => false);
      console.log(err);
    }
  };
  const displayInputGradeRanges = inputGradeRange?.map((list) => {
    return (
      <ul
        key={list.id}
        className="w-full gap-5 justify-center items-center flex my-2"
      >
        <li className="w-20 ">
          <TextField
            id="outlined-number"
            label="grade"
            name="title"
            type="text"
            onChange={(e) =>
              handleChangeGradeRangeInput({
                id: list.id,
                field: 'title',
                value: e.target.value,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
            value={list.title}
          />
        </li>
        <li className="w-20">
          <TextField
            id="outlined-number"
            label="max"
            name="max"
            onChange={(e) =>
              handleChangeGradeRangeInput({
                id: list.id,
                field: 'max',
                value: e.target.value,
              })
            }
            type="number"
            value={list.max}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </li>
        <li className="w-20">
          <TextField
            id="outlined-number"
            label="min"
            type="number"
            value={list.min}
            name="min"
            onChange={(e) =>
              handleChangeGradeRangeInput({
                id: list.id,
                field: 'min',
                value: e.target.value,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </li>
        <li className="w-20">
          <button
            onClick={() => handleDeleteGradeRange(list.id)}
            className="w-10 h-10 bg-red-200 text-red-700 rounded-full flex justify-center items-center
          hover:scale-105 transition duration-150 hover:text-red-200 hover:bg-red-700"
          >
            <AiFillDelete />
          </button>
        </li>
      </ul>
    );
  });
  return (
    <div className="fixed w-screen flex items-center justify-center h-screen top-0 bottom-0 right-0 left-0 m-auto z-50">
      <main className="  flex flex-col justify-start gap-5 items-center rounded-md p-5 bg-white min-w-[20rem] min-h-[20rem] w-max h-max max-w-3xl max-h-[90%]">
        <h1 className="font-medium text-2xl ">Grade setting</h1>
        <div className="h-96 overflow-auto">
          {displayInputGradeRanges}
          <button
            onClick={() => {
              const newGradeRange = [
                ...inputGradeRange,
                { id: inputGradeRange.length + 1, title: '', max: 0, min: 0 },
              ];

              setInputGradeRange(() => newGradeRange);
            }}
            className="w-full p-3 border-2 border-dotted border-black rounded-lg
          flex justify-center items-center text-lg hover:border-blue-400 hover:text-blue-500 transition duration-150"
          >
            <BsPlusCircleDotted />
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <button
            onClick={handleCreateGrade}
            className="w-28 py-2 active:ring-2 ring-black appearance-none hover:bg-blue-700 transition
             duration-150 bg-blue-500 text-white font-semibold rounded-lg"
          >
            update
          </button>
        )}
      </main>
      <footer
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerCreateGrade(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default CreateGrade;
