import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Left, LoadingPage, HeadLine } from '../../components/organism';
import { ObjectsResult } from './ObjectsResult';
import { fetchAnalysis, requestAnalysisApi } from '../../store/slice/analysisSlice';
import { requestDictionaryApi } from '../../store/slice/dictionarySlice';
import { requestExtractTextPdfApi } from '../../store/slice/extractTextPdfSlice';
import { useParams, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
  },
  contents: { height: '100%' },
  blockRight: { padding: '24px 24px 0 21px', position: 'relative' },
}));

export function Objects({ env }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState([]);
  const [content, setContent] = useState({});
  const [isProgress, setProgress] = useState(false);
  const [onResult, setOnResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dictionaryResponse, setdictionaryResponse] = useState(null);
  const dispatch = useDispatch();

  // 解析結果の取得
  const analysis = useSelector(requestAnalysisApi);
  useEffect(() => {
    const { loading, error, items } = analysis;
    // 結果が返ってくるまでは処理中のprogressぐるぐるを表示する
    setProgress(loading);
    setLoading(loading);
    // 取得処理が終わったら画面を切り替える
    if (!loading && items) {
      const response = error ? { content: { error } } : items;
      setResponse(response);
      // TODO
      if (response && Array.isArray(response.content)) {
        setContent(response.content[0]);
      } else {
        setContent(response.content);
      }
      setPage(1);
      response.length != 0 && response ? setOnResult(true) : setOnResult(false);
      if (((response || {}).content || {}).error) {
        setOnResult(false);
      }
    }
  }, [analysis]);

  // 辞書登録削除結果の取得
  const dictionary = useSelector(requestDictionaryApi);
  useEffect(() => {
    const { loading, error, items } = dictionary;
    setLoading(loading);
    if (!loading && items) {
      const response = error ? { content: { error } } : items;
      setdictionaryResponse(response);
    }
  }, [dictionary]);

  // 辞書登録削除のレスポンスを受けた後、解析APIを呼び出す
  const match = useRouteMatch();
  const { userId } = useParams();
  useEffect(() => {
    if (dictionaryResponse && inputValue && userId && !dictionary.loading) {
      dispatch(fetchAnalysis(inputValue, match.path, userId || '', env));
    }
  }, [dictionaryResponse]);

  // PDFファイル解析の結果
  const extractTextPdf = useSelector(requestExtractTextPdfApi);
  useEffect(() => {
    const { loading, error, items } = extractTextPdf;
    setLoading(loading);
    if (!loading && items) {
      const response = error ? { content: { error } } : items;
      setInputValue(response.content);
    }
  }, [extractTextPdf]);

  return (
    <div>
      {loading && <LoadingPage />}
      <div className={classes.root}>
        <HeadLine
          env={env}
          response={response}
          onResult={onResult}
          loading={loading}
          setContent={setContent}
          setPage={setPage}
          page={page}
        />
        <Grid
          container
          direction='row'
          justify='center'
          item
          xs={12}
          md
          className={classes.contents}>
          <Left
            onResult={onResult}
            setInputValue={setInputValue}
            inputValue={inputValue}
            setOnResult={setOnResult}
            content={content}
            loading={loading}
            env={env}
          />
          <Grid item xs md className={classes.blockRight}>
            <ObjectsResult content={content} env={env} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
