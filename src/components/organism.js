import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { InputField } from '../features/scriptEngine/InputField';
import { AnalyzeButton } from '../features/scriptEngine/AnalyzeButton';
import { EditButton } from '../features/scriptEngine/EditButton';
import { TextField } from '../features/scriptEngine/TextField';
import { useDropzone } from 'react-dropzone';
import { OpenFileDialogButton } from '../components/molecules';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Pagination from '@material-ui/lab/Pagination';
import { Link, useParams } from 'react-router-dom';
import { fetchExtractTextPdf, extractTextPdfSlice } from '../store/slice/extractTextPdfSlice';

const useStyles = makeStyles((theme) => ({
  blockLeft: { padding: '24px 12px 0 24px', position: 'relative' },
  originalText: { height: '100vh' },
  loadingPage: {
    backgroundColor: 'rgba(158, 158, 158, 0.8)',
    zIndex: 100,
    position: 'absolute',
    width: '100%',
    height: '100vh',
  },
  progress: {
    position: 'absolute',
    right: '50%',
    bottom: '50%',
  },
  title: { fontSize: 'x-large', marginLeft: 24, fontWeight: 'bold' },
  chip: { alignSelf: 'end', marginLeft: 5, marginRight: 10 },
  manualLink: { alignSelf: 'center', marginLeft: 10, zIndex: 99 },
  pagenation: {
    '& > *': {
      margin: '15px 0 0 0',
      justifyContent: 'center',
      display: 'flex',
      width: '100%',
    },
    height: 32,
  },
  dictionaryListLink: {
    textAlign: 'right',
    right: 27,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 99,
  },
}));

export function Left({ onResult, setInputValue, inputValue, setOnResult, content, loading, env }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // add
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    // accept: 'text/*, xml/*',
    onDrop: (files) => {
      files.map((file) => {
        const reader = new FileReader();
        if (file.type === 'application/pdf') {
          reader.readAsDataURL(file);
          reader.onloadstart = async () => {
            const { fetchStart } = extractTextPdfSlice.actions;
            dispatch(fetchStart());
          };
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = async () => {
            // pdfの処理
            const base64Pdf = reader.result.replace('data:application/pdf;base64,', '');
            await dispatch(fetchExtractTextPdf(env, base64Pdf));
            return;
          };
        } else {
          reader.readAsText(file);
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = async () => {
            setInputValue(reader.result);
          };
        }
      });
    },
  });

  return (
    <Grid item xs md className={classes.blockLeft}>
      {!onResult && (
        <div>
          <InputField
            setInputValue={setInputValue}
            inputValue={inputValue}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
          <OpenFileDialogButton
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            open={open}
            loading={loading}
          />
          <AnalyzeButton inputValue={inputValue} loading={loading} env={env} />
        </div>
      )}
      {onResult && (
        <div className={classes.originalText}>
          <EditButton setOnResult={setOnResult} loading={loading} />
          <TextField content={content} env={env} />
        </div>
      )}
    </Grid>
  );
}

export function LoadingPage() {
  const classes = useStyles();
  return (
    <div className={classes.loadingPage}>
      <CircularProgress className={classes.progress} />
    </div>
  );
}

export function HeadLine({ env, response, onResult, loading, setContent, setPage, page }) {
  const classes = useStyles();
  const { userId } = useParams();
  return (
    <div style={{ height: 32, marginTop: 15 }}>
      <Grid container direction='row'>
        <div className={classes.title}>Script Analyzer</div>
        {env!='release' && (
          <div className={classes.chip}>
            <Chip variant='outlined' size='small' label={env} />
          </div>
        )}
        <div className={classes.manualLink}>
          <a href='/manual_en.html' target='_blank'>
            How to Use
          </a>
        </div>
        {userId && (
          <div className={classes.dictionaryListLink}>
            <Link to={`/dictionary/id/${userId}?env=${env}`}>Dictionary List</Link>
          </div>
        )}
      </Grid>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        {onResult && !loading && (
          <Pagination
            count={((response || {}).content || {}).length || 0}
            className={classes.pagenation}
            onChange={(event, page) => {
              // TODO
              if (response && Array.isArray(response.content)) {
                setContent(response.content[page - 1]);
              }
              setPage(page);
            }}
            page={page}
          />
        )}
      </div>
    </div>
  );
}
