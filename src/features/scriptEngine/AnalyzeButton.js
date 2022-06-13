import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { fetchAnalysis } from '../../store/slice/analysisSlice';
import { useParams, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100px',
    height: '50px',
    position: 'absolute',
    right: 44,
    bottom: 0,
  },
}));

export function AnalyzeButton({ inputValue, loading, env }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { userId } = useParams();

  return (
    <div>
      <Button
        size='small'
        variant='contained'
        color='primary'
        className={classes.button}
        disabled={loading}
        onClick={() => {
          dispatch(fetchAnalysis(inputValue, match.path, userId || '', env));
        }}>
        Analyze
      </Button>
    </div>
  );
}
