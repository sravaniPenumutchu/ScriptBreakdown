import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100px',
    height: '50px',
    position: 'absolute',
    right: 44,
    top: 25,
  },
}));

export function EditButton({ setOnResult, loading }) {
  const classes = useStyles();

  return (
    <div>
      <Button
        size='small'
        variant='contained'
        color='primary'
        className={classes.button}
        disabled={loading}
        onClick={() => {
          setOnResult(false);
        }}>
        Edit
      </Button>
    </div>
  );
}
