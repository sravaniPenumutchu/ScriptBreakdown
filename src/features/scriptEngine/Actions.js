import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Left } from '../../components/organism';
import { ActionsResult } from './ActionsResult';
import CircularProgress from '@material-ui/core/CircularProgress';
import { requestAnalysisApi } from '../../store/slice/analysisSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
  },
  contents: { height: '100%' },
  blockRight: { padding: '48px 48px 48px 24px', position: 'relative' },
  progress: {
    position: 'absolute',
    right: '50%',
    bottom: '50%',
  },
}));

export function Actions({ env }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState([]);
  const [isProgress, setProgress] = useState(false);
  const [onResult, setOnResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // 解析結果の取得
  const analysis = useSelector(requestAnalysisApi);
  useEffect(() => {
    const { loading, error, items } = analysis;
    // 結果が返ってくるまでは処理中のpregressぐるぐるを表示する
    setProgress(loading);
    setLoading(loading);
    // 取得処理が終わったら画面を切り替える
    if (!loading && items) {
      const response = error ? { content: { error } } : items;
      setResponse(response);
      response.length != 0 && response ? setOnResult(true) : setOnResult(false);
      if (((response || {}).content || {}).error) {
        setOnResult(false);
      }
    }
  }, [analysis]);

  return (
    <div className={classes.root}>
      <Grid container direction='row' justify='center' item xs={12} md className={classes.contents}>
        <Left
          onResult={onResult}
          setInputValue={setInputValue}
          inputValue={inputValue}
          setProgress={setProgress}
          setOnResult={setOnResult}
          response={response}
          loading={loading}
          env={env}
        />
        <Grid item xs md className={classes.blockRight}>
          <ActionsResult response={response} setProgress={setProgress} />
          {isProgress && <CircularProgress className={classes.progress} />}
        </Grid>
      </Grid>
    </div>
  );
}
