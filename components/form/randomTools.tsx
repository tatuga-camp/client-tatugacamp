import React from "react";
import { GiCarWheel, GiCardBurn, GiCartwheel } from "react-icons/gi";

type RandomToolsProps = {
  setTriggerRandomTools: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerRouletteRandomStudent: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setTriggerRandomStudent: React.Dispatch<React.SetStateAction<boolean>>;
};

function RandomTools({
  setTriggerRandomTools,
  setTriggerRouletteRandomStudent,
  setTriggerRandomStudent,
}: RandomToolsProps) {
  return (
    <div className="w-screen z-40 h-screen fixed m-auto right-0 left-0 bottom-0 top-0 flex justify-center items-center">
      <main className="w-96 h-40 bg-white rounded-lg flex  justify-center items-center gap-5">
        <button
          onClick={() => {
            document.body.style.overflow = "hidden";
            setTriggerRandomStudent(() => true);
            setTriggerRandomTools(() => false);
          }}
          className="w-40 h-14 hover:scale-110 transition duration-150 bg-green-600 rounded-lg gap-3 drop-shadow-sm flex items-center justify-center"
        >
          <div
            className="w-10 h-10 bg-green-200 backdrop-blur-sm text-green-600
           rounded-lg flex items-center justify-center text-3xl"
          >
            <GiCardBurn />
          </div>
          <span className="text-green-200 font-Poppins font-semibold">
            card
          </span>
        </button>
        <button
          onClick={() => {
            document.body.style.overflow = "hidden";
            setTriggerRouletteRandomStudent(() => true);
            setTriggerRandomTools(() => false);
          }}
          className="w-40 h-14 hover:scale-110 transition duration-150 bg-blue-600 rounded-lg gap-3 drop-shadow-sm flex items-center justify-center"
        >
          <div
            className="w-10 h-10 bg-blue-200 backdrop-blur-sm text-blue-600
           rounded-lg flex items-center justify-center text-3xl"
          >
            <GiCartwheel />
          </div>
          <span className="text-blue-200 font-Poppins font-semibold">
            wheel
          </span>
        </button>
      </main>
      <footer
        onClick={() => {
          setTriggerRandomTools(() => false);
          document.body.style.overflow = "auto";
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default RandomTools;
