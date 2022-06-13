import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    height: '89vh',
    width: '49vw',
    overflowY: 'scroll',
    overflowX: 'auto',
  },
  lineRoot: { width: '100%' },
  table: { borderCollapse: 'collapse', width: '100%' },
  tableLineTh: {
    textAlign: 'left',
    backgroundColor: '#dcdcdc',
    border: 'solid 1px black',
  },
  tableLineTd: {
    border: 'solid 1px black',
    width: '25%',
  },
});

export function ActionsResult({ response }) {
  const { content } = response;
  const classes = useStyles();

  if (!content) {
    return <></>;
  }

  return (
    <Grid item xs className={classes.root} justifycontent='space-between' variant='outlined'>
      <pre>{JSON.stringify(content, null, 4)}</pre>
    </Grid>
  );
}
