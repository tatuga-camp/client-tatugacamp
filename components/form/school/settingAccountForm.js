import { Box, TextField } from "@mui/material";
import React from "react";
import { FaUserSlash } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

function SettingAccountForm({ selectTeacher }) {
  return (
    <div className="w-96 p-3 h-full flex flex-col items-center justify-start ring-2 gap-3 rounded-3xl">
      <div className="w-24  h-24  bg-blue-400 flex justify-center items-center text-white mt-2 rounded-md">
        {selectTeacher?.picture ? (
          <Image
            src={selectTeacher.picture}
            layout="fill"
            className="object-cover"
          />
        ) : (
          <span className="font-bold text-5xl">
            {selectTeacher.firstName.charAt(0)}
          </span>
        )}
      </div>
      <div className="w-20 bg-green-400 text-center p-1 text-white">ACTIVE</div>
      <Box width="100%">
        <TextField
          name="email"
          fullWidth
          value={selectTeacher.email}
          required
        />
      </Box>
      <div className="flex items-center gap-2">
        <Box width="100%">
          <TextField
            name="firstName"
            fullWidth
            value={selectTeacher.firstName}
            required
          />
        </Box>
        <Box width="100%">
          <TextField
            name="lastName"
            fullWidth
            value={selectTeacher.lastName}
            required
          />
        </Box>
      </div>
      <Box width="100%">
        <TextField
          name="phone"
          fullWidth
          value={selectTeacher.phone}
          required
        />
      </Box>
      <Box width="100%">
        <TextField
          name="school"
          fullWidth
          value={selectTeacher.school}
          required
        />
      </Box>
      <div className="flex justify-center gap-2">
        <button className="flex gap-1 p-3 transition duration-100 hover:scale-105 active:ring-2 bg-slate-300 rounded-lg items-center">
          <div className="flex justify-center items-center">
            <FaUserSlash />
          </div>
          <span>disable user</span>
        </button>
        <button className="flex gap-1 p-3 transition duration-100 hover:scale-105 active:ring-2 bg-slate-300 rounded-lg items-center">
          <div className="flex justify-center items-center">
            <RiLockPasswordLine />
          </div>
          <span>รีเซ็ทรหัสผ่าน</span>
        </button>
      </div>
      <button className="bg-blue-400 p-2 rounded-xl drop-shadow-md text-white px-10 hover:scale-105 transition duration-150 active:ring-2">
        SAVE
      </button>
    </div>
  );
}

export default SettingAccountForm;
