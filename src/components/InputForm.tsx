import React from 'react';
import { TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { FormikProps } from 'formik';
import { FormValue } from '../types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      '& .MuiTextField-root': {
        //margin: theme.spacing(1),
        width: 492,
      },
    },
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    inline: {
      display: 'inline',
    },
  }),
);

export const InputForm: React.FC<{formikBag: FormikProps<FormValue>}> = ({
  formikBag,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.input}>
      <TextField
        id="standard-search"
        size="medium"
        error={!formikBag.isValid}
        name="value"
        label="YouTube URL"
        type="search"
        onChange={formikBag.handleChange}
        helperText={formikBag.errors.value}
      />
      <IconButton
        color="primary"
        aria-label="upload picture"
        disabled={!formikBag.isValid}
        component="span"
        onClick={() => formikBag.submitForm().catch(err => formikBag.setErrors(err))}
      >
        <AddCircleIcon fontSize="large" />
      </IconButton>
    </div>
  );
};