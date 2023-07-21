import React from "react";

function CreateAccount({ close, setTriggerAccountManagement }) {
  return (
    <div
      className="z-50 
    top-0 right-0 left-0 bottom-0 m-auto fixed flex justify-center items-center"
    >
      <div className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 ">
        <form className=" w-80 flex flex-col justify-center items-center "></form>
      </div>
      <div
        onClick={() => {
          setTriggerAccountManagement(() => false);
          document.body.style.overflow = "auto";
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}
export default CreateAccount;
