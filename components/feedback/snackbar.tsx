import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { FcFeedback } from "react-icons/fc";
import CreateFeedback from "../form/createFeedback";
import { User } from "../../models";

function FeedbackSankbar({
  language,
  user,
}: {
  language: "Thai" | "English";
  user: User;
}) {
  const [open, setOpen] = useState(true);
  const [isFeedback, setIsfeedback] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseFeedback = () => {
    document.body.style.overflow = "auto";
    setIsfeedback(false);
    setOpen(true);
  };
  const handleOpenFeedback = () => {
    document.body.style.overflow = "hidden";
    setIsfeedback(true);
    setOpen(false);
  };
  return (
    <div className="hidden md:block	">
      {isFeedback && (
        <CreateFeedback
          user={user}
          language={language}
          handleCloseFeedback={handleCloseFeedback}
        />
      )}
      <Snackbar
        onClick={handleOpenFeedback}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        className="
        bg-green-400 text-black p-3 px-3 hover:bg-green-500 hover:scale-105
        transition duration-200 rounded-xl cursor-pointer  active:bg-green-600"
        open={open}
      >
        <div className=" flex items-center justify-between w-full gap-3 font-Kanit">
          <div className="flex gap-2">
            <div
              className="flex text-2xl text-white
           items-center justify-center"
            >
              <FcFeedback />
            </div>
            <div className="flex">
              <span>
                {language === "Thai" && "Feedback ของท่านคือความหวังของเรา"}
                {language === "English" && "Your feedback is our light of hope"}
              </span>
            </div>
          </div>
        </div>
      </Snackbar>
    </div>
  );
}

export default FeedbackSankbar;
