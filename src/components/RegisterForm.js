import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useSnackbar } from 'notistack';

import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import useAuthContext from '@/hooks/useAuthContext';

export const RegisterForm = () => {
  const router = useRouter();
  const { register } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      age: '',
      email: '',
      password: '',
      submit: null,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      dateOfBirth: Yup.date().required('Data of birth is required'),
      age: Yup.number().required('Age is required'),
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup.string().min(8).max(255).required('Password is required'),
    }),

    onSubmit: async ({
      firstName,
      lastName,
      dateOfBirth,
      age,
      email,
      password,
    }) => {
      try {
        await register({
          firstName,
          lastName,
          dateOfBirth,
          age,
          email,
          password,
        });
        enqueueSnackbar('User registered successfully!', {
          variant: 'success',
        });
        formik.resetForm();
        router.push('/login');
      } catch (err) {
        enqueueSnackbar('User registered failed!', {
          variant: 'error',
        });
      }
    },
  });

  const handleDateOfBirthChange = (date) => {
    formik.setFieldValue('dateOfBirth', date);
    formik.setFieldValue('age', moment().year() - date.year());
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <OutlinedInput
              fullWidth
              id="firstName"
              name="firstName"
              value={formik.values.firstName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="First name"
              error={Boolean(
                formik.touched.firstName && formik.errors.firstName
              )}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <FormHelperText error>{formik.errors.firstName}</FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <OutlinedInput
              fullWidth
              id="lastName"
              name="lastName"
              value={formik.values.lastName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Last name"
              error={Boolean(formik.touched.lastName && formik.errors.lastName)}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <FormHelperText error>{formik.errors.lastName}</FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="dateOfBirth">Date of birth</InputLabel>
            <DatePicker
              fullWidth
              id="dateOfBirth"
              name="dateOfBirth"
              disableFuture
              value={formik.values.dateOfBirth}
              onBlur={formik.handleBlur}
              onChange={handleDateOfBirthChange}
              placeholder="Date of birth"
              slotProps={{
                textField: {
                  error: Boolean(
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  ),
                  helperText: formik.errors.dateOfBirth,
                },
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="age">Age</InputLabel>
            <OutlinedInput
              fullWidth
              id="age"
              name="age"
              type="number"
              readOnly
              value={formik.values.age}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Age"
              error={Boolean(formik.touched.age && formik.errors.age)}
            />
            {formik.touched.age && formik.errors.age && (
              <FormHelperText error>{formik.errors.age}</FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email">Email Address*</InputLabel>
            <OutlinedInput
              fullWidth
              id="email"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Email"
              inputProps={{}}
              error={Boolean(formik.touched.email && formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error>{formik.errors.email}</FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-signup">Password</InputLabel>
            <OutlinedInput
              fullWidth
              id="password-signup"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color="secondary"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="******"
              inputProps={{}}
              error={Boolean(formik.touched.password && formik.errors.password)}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error>{formik.errors.password}</FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={1}>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={25} color="info" />
              ) : (
                <span>Register</span>
              )}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="title" textAlign="center">
              Has account already? <Link href="/login">Login</Link>
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};
