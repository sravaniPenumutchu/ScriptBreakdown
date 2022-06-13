import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '../../components/Table';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '89vh',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  cardContent: {
    height: '89vh',
    width: '100%',
    overflow: 'auto',
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
}));

export function ObjectsResult({ content, env }) {
  const classes = useStyles();
  return (
    <div>
      <Grid item xs className={classes.root} justifycontent='space-between' variant='outlined'>
        <Table content={content} env={env} />
      </Grid>
    </div>
  );
}
