import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../loading/loading';
import { useRouter } from 'next/router';
import { UpdatePercentageClassroom } from '../../service/classroom';
import { BiReset } from 'react-icons/bi';
import { ResetSpecialScorePercentage } from '../../service/scores';

function AddPercentageOnSpecialScore({
  setTriggerAddPercentageOnSpecialScore,
  studentsScores,
  classroom,
}) {
  const router = useRouter();
  const [percent, setPercent] = useState();
  const [fullScore, setFullScore] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  useEffect(() => {
    const desiredPercentage = parseFloat(
      studentsScores?.data?.data?.classroom?.specialScorePercentage?.replace(
        '%',
        '',
      ),
    );
    setFullScore(() => studentsScores?.data?.data?.classroom?.maxScore);
    setPercent(() => desiredPercentage);
  }, []);
  const handleSummitUpdatePercent = async () => {
    try {
      setLoading(() => true);
      await UpdatePercentageClassroom({
        percentage: `${percent}%`,
        classroomId: router.query.classroomId,
        maxScore: fullScore,
      });
      await studentsScores.refetch();
      await classroom.refetch();
      setTriggerAddPercentageOnSpecialScore(() => false);
      document.body.style.overflow = 'auto';
      Swal.fire('Success', '', 'success');
      setLoading(() => false);
    } catch (err) {
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      setLoading(() => false);
      console.error(err);
    }
  };
  const handleResetPercentage = async () => {
    try {
      setLoadingReset(() => true);
      await ResetSpecialScorePercentage({
        classroomId: classroom?.data?.data?.id,
      });
      studentsScores.refetch();
      classroom.refetch();
      setLoadingReset(() => false);
      setTriggerAddPercentageOnSpecialScore(() => false);
      document.body.style.overflow = 'auto';
      Swal.fire('Success', '', 'success');
    } catch (err) {
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      setLoadingReset(() => false);
      console.error(err);
    }
  };

  return (
    <div className="fixed font-Kanit w-screen flex items-center justify-center h-screen top-0 bottom-0 right-0 left-0 m-auto z-50">
      <main
        className="  flex flex-col relative text-xl justify-start gap-5 items-center 
      rounded-md p-5 bg-white min-w-[20rem]  w-max h-max max-w-3xl max-h-[90%]"
      >
        {classroom?.data?.data?.specialScorePercentage && (
          <div className="w-full h-max flex justify-end">
            {loadingReset ? (
              <Loading />
            ) : (
              <button
                onClick={handleResetPercentage}
                className="flex group items-center justify-center flex-col"
              >
                <div
                  className="w-7 h-7 rounded-lg bg-red-500 group-hover:bg-red-600 transition duration-150
              text-white flex items-center justify-center active:scale-110"
                >
                  <BiReset />
                </div>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition duration-150">
                  reset setting
                </span>
              </button>
            )}
          </div>
        )}

        <TextField
          label="คะแนนเต็ม"
          type="number"
          value={fullScore}
          required
          onChange={(e) => setFullScore(() => e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="เปอร์เซ็นต์"
          type="number"
          value={percent}
          onChange={(e) => setPercent(() => e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {loading ? (
          <Loading />
        ) : (
          <button
            onClick={handleSummitUpdatePercent}
            className="w-28 py-2 active:ring-2 hover:bg-blue-700 ring-black
         transition duration-150 bg-blue-500 text-white font-semibold rounded-lg"
          >
            update
          </button>
        )}
      </main>
      <footer
        onClick={() => {
          setTriggerAddPercentageOnSpecialScore(() => false);
          document.body.style.overflow = 'auto';
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default AddPercentageOnSpecialScore;
