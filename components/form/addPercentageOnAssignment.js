import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../loading/loading';
import { UpdatePercentAssignment } from '../../service/assignment';
import { BiReset } from 'react-icons/bi';
import { ResetAassignmentPercentage } from '../../service/scores';

function AddPercentageOnAssignment({
  setTriggerAddPercentage,
  selectAssignment,
  studentsScores,
}) {
  const [percent, setPercent] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  useEffect(() => {
    const desiredPercentage = parseFloat(
      selectAssignment?.percentage?.replace('%', ''),
    );
    setPercent(() => desiredPercentage);
  }, []);
  const handleSummitUpdatePercent = async () => {
    try {
      setLoading(() => true);
      await UpdatePercentAssignment({
        percentage: `${percent}%`,
        assignmentId: selectAssignment.id,
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
  const handleResetAssignmentPercentage = async () => {
    try {
      setLoadingReset(() => true);
      await ResetAassignmentPercentage({
        assignmentId: selectAssignment.id,
      });
      studentsScores.refetch();
      setLoadingReset(() => false);
      setTriggerAddPercentage(() => false);
      document.body.style.overflow = 'auto';
      Swal.fire('Success', '', 'success');
    } catch (err) {
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      setLoadingReset(() => false);
      console.log(err);
    }
  };
  return (
    <div className="fixed font-Kanit w-screen flex items-center justify-center h-screen top-0 bottom-0 right-0 left-0 m-auto z-50">
      <main
        className="  flex flex-col text-xl justify-start gap-5 items-center 
      rounded-md p-5 bg-white min-w-[20rem]  w-max h-max max-w-3xl max-h-[90%]"
      >
        {selectAssignment?.percentage && (
          <div className="w-full h-max flex justify-end">
            {loadingReset ? (
              <Loading />
            ) : (
              <button
                onClick={handleResetAssignmentPercentage}
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
        <h1>{selectAssignment.title}</h1>
        <h2>คะแนนดิบ {selectAssignment.maxScore}</h2>
        <TextField
          label="เปอร์เซ็นต์"
          name="max"
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
            className="w-28 py-2 active:ring-2 hover:bg-blue-700
         transition duration-150 bg-blue-500 text-white font-semibold rounded-lg"
          >
            update
          </button>
        )}
      </main>
      <footer
        onClick={() => {
          setTriggerAddPercentage(() => false);
          document.body.style.overflow = 'auto';
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default AddPercentageOnAssignment;
