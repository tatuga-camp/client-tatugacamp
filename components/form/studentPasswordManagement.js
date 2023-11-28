import React from 'react';

function StudentPasswordManagement({ setTriggerStudentPasswordManagement }) {
  return (
    <main className="w-screen h-screen fixed z-50 top-0 bottom-0 right-0 left-0 flex items-center justify-center">
      <section className="w-96 h-96 bg-white"></section>
      <footer
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerStudentPasswordManagement(() => false);
        }}
        className={`w-screen  h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10  bg-black/30 `}
      ></footer>
    </main>
  );
}

export default StudentPasswordManagement;
