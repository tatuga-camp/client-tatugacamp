import React from 'react';

function AddPercentageOnAssignment({
  setTriggerAddPercentage,
  selectAssignment,
}) {
  return (
    <div className="fixed w-screen flex items-center justify-center h-screen top-0 bottom-0 right-0 left-0 m-auto z-50">
      <main
        className="  flex flex-col justify-start gap-5 items-center 
      rounded-md p-5 bg-white min-w-[20rem] min-h-[20rem] w-max h-max max-w-3xl max-h-[90%]"
      >
        <h1>{selectAssignment.title}</h1>
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
