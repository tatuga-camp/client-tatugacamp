import { MenuItem, Pagination, TextField } from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Loading from "../loading/loading";
import { UpdateClassroomOrder } from "../../service/classroom";
import { Classroom, Language } from "../../models";

type UpdateOrderClassroomProps = {
  language: Language;
  setTiggerUpdateOrderClassroom: React.Dispatch<React.SetStateAction<boolean>>;
  selectUpdateOrderClassroom: Classroom & { selected: boolean };
  activeClassroomTotal;
  classrooms: Classroom;
};
function UpdateOrderClassroom({
  language,
  setTiggerUpdateOrderClassroom,
  selectUpdateOrderClassroom,
  activeClassroomTotal,
  classrooms,
}) {
  const [activeOrder, setActiveOrder] = useState({
    index: "",
    value: "",
  });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20; // Number of items to show per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const listOrderClassroom = Array.from(
    { length: activeClassroomTotal },
    (_, index) => index + 1
  );

  const handleSummitUpdateOrder = async () => {
    try {
      setLoading(() => true);
      await UpdateClassroomOrder({
        classroomId: selectUpdateOrderClassroom.id,
        order: activeOrder.value,
      });
      setLoading(() => false);

      Swal.fire("success", "update successfully", "success");
      classrooms.refetch();
    } catch (err) {
      setLoading(() => false);
      console.log("err", err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  return (
    <div
      className="z-50 w-screen h-screen
    top-0 right-0 left-0 bottom-0 m-auto fixed flex justify-center items-center"
    >
      <div
        className="flex items-center justify-between gap-2 lg:gap-2 xl:gap-5  min-w-[30rem] max-w-4xl h-max min-h-[24rem] max-h-[90%] 
       flex-col font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-2 "
      >
        <header className="flex flex-col gap-0 mb-5 justify-center items-center">
          <span className="font-Kanit lg:text-base xl:text-xl text-orange-500 font-semibold">
            {selectUpdateOrderClassroom.title}
          </span>
          <span className="font-Kanit lg:text-base xl:text-lg text-gray-500 font-normal">
            {selectUpdateOrderClassroom.level}
          </span>
          <span className="font-Kanit lg:text-base xl:text-lg text-black font-semibold">
            {selectUpdateOrderClassroom.description}
          </span>
        </header>

        <ul className="w-9/12 place-items-center gap-2 grid grid-cols-3 md:grid-cols-3 lg:gap-2 xl:gap-5 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {listOrderClassroom.slice(startIndex, endIndex).map((list, index) => {
            return (
              <li
                role="button"
                onClick={() =>
                  setActiveOrder(() => {
                    return {
                      index: index,
                      value: list,
                    };
                  })
                }
                className={`${
                  activeOrder.index === index
                    ? "bg-blue-500 text-white"
                    : "text-black bg-white"
                } ${
                  selectUpdateOrderClassroom.order === list
                    ? "ring-red-500 "
                    : "ring-blue-500 "
                }
                w-10 select-none active:scale-110 active:ring-4  hover:bg-blue-500 transition duration-150 hover:text-white cursor-pointer
             font-semibold  h-10 text-center flex justify-center items-center ring-2 appearance-none ring-black
               rounded-lg`}
                key={index}
              >
                {list}
              </li>
            );
          })}
        </ul>
        {loading ? (
          <Loading />
        ) : (
          <button
            onClick={handleSummitUpdateOrder}
            className="py-2 px-4 rounded-lg bg-green-600 text-white 
        font-semibold hover:bg-green-800 transition duration-150"
          >
            update
          </button>
        )}
        <Pagination
          onClick={() =>
            setActiveOrder(() => {
              return {
                index: "",
                value: "",
              };
            })
          }
          count={classrooms?.data?.totalPages}
          onChange={(e, page) => setPage(page)}
        />
      </div>
      <div
        onClick={() => {
          setTiggerUpdateOrderClassroom(() => false);
          document.body.style.overflow = "auto";
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default UpdateOrderClassroom;
