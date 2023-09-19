import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CreateAccount } from '../../../service/school/teacher';
import Swal from 'sweetalert2';
import Loading from '../../loading/loading';

function CreateAccountForm({ teachers }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    school: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [require, setRequire] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validatePassword = () => {
    if (teacherData.password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTeacherData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (
      teacherData.email !== '' &&
      teacherData.lastName !== '' &&
      teacherData.password !== '' &&
      teacherData.phone !== '' &&
      teacherData.school !== ''
    ) {
      setRequire(() => false);
    } else {
      setRequire(() => true);
    }
  }, [teacherData]);

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSummitCreateTeacher = async () => {
    try {
      setLoading(() => true);
      await CreateAccount({
        email: teacherData.email,
        password: teacherData.password,
        phone: teacherData.phone,
        school: teacherData.school,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
      });
      setTeacherData(() => {
        return {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          school: '',
        };
      });
      teachers.refetch();
      setLoading(() => false);
      setConfirmPassword(() => '');
      Swal.fire('success', 'success', 'success');
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'Error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };
  return (
    <form className="w-96 p-3 h-full flex flex-col items-center justify-center ring-2 ring-black gap-3 rounded-3xl">
      <h3>สร้างบัญชี</h3>

      <Box width="100%">
        <TextField
          type="email"
          onChange={handleChange}
          name="email"
          label="email"
          fullWidth
          required
          value={teacherData.email}
        />
      </Box>
      <FormControl
        sx={{ m: 1, width: '100%' }}
        variant="outlined"
        error={passwordError}
      >
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          autoComplete="on"
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={teacherData.password}
          onChange={handleChange}
          onBlur={validatePassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {passwordError && <p>Passwords do not match.</p>}
      </FormControl>
      <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-confirm-password">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          autoComplete="on"
          id="outlined-adornment-confirm-password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={validatePassword}
          label="Confirm Password"
        />
        {passwordError && <p>Passwords do not match.</p>}
      </FormControl>
      <div className="flex items-center gap-2">
        <Box width="100%">
          <TextField
            onChange={handleChange}
            name="firstName"
            label="first name"
            fullWidth
            value={teacherData.firstName}
            required
          />
        </Box>
        <Box width="100%">
          <TextField
            onChange={handleChange}
            name="lastName"
            label="last name"
            fullWidth
            value={teacherData.lastName}
            required
          />
        </Box>
      </div>
      <div className="flex gap-2 ">
        <Box width="100%">
          <TextField
            onChange={handleChange}
            name="phone"
            label="phone number"
            fullWidth
            value={teacherData.phone}
            required
          />
        </Box>
        <Box width="100%">
          <TextField
            onChange={handleChange}
            name="school"
            label="school"
            fullWidth
            value={teacherData.school}
            required
          />
        </Box>
      </div>
      {passwordError || require ? (
        <div
          type="button"
          className="bg-slate-400 p-2 rounded-xl drop-shadow-md text-white px-10"
        >
          CREATE
        </div>
      ) : loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSummitCreateTeacher}
          className="bg-blue-400 p-2 rounded-xl drop-shadow-md text-white px-10 hover:scale-105 transition duration-150 active:ring-2"
        >
          CREATE
        </button>
      )}
    </form>
  );
}

export default CreateAccountForm;
