import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { fetchDictionay, requestDictionaryApi } from '../../store/slice/dictionarySlice';
import { DictionaryTable } from '../../components/molecules';
import { ElementsOptions } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 30,
    height: '90vh',
    overflowY: 'scroll',
  },
}));

export function Dictionary({ env }) {
  const classes = useStyles();
  const { userId } = useParams();
  const [dictionaryResponse, setdictionaryResponse] = useState(null);
  const dispatch = useDispatch();

  // 辞書一覧の取得
  useEffect(async () => {
    await dispatch(
      fetchDictionay({
        param: {
          user_id: userId,
        },
        apiType: 'list',
        env,
      })
    );
  }, []);

  const dictionary = useSelector(requestDictionaryApi);
  useEffect(() => {
    const { loading, error, items } = dictionary;
    if (!loading && items) {
      const response = error ? { content: { error } } : items;
      setdictionaryResponse(response);
    }
  }, [dictionary]);

  return (
    <div className={classes.root}>
      {dictionaryResponse &&
        dictionaryResponse.content.length > 0 &&
        ElementsOptions.map((element) => {
          const item = dictionaryResponse.content.find((item) => {
            if (item.category.toUpperCase() === element) {
              return item;
            }
          });
          return (
            <DictionaryTable
              element={element}
              extracts={item.extract.join(', ')}
              excludes={item.exclude.join(', ')}
            />
          );
        })}
    </div>
  );
}
