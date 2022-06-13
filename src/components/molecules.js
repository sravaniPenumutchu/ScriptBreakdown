import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ElementsOptions } from '../utils/constants';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import { fetchDictionay } from '../store/slice/dictionarySlice';
import Button from '@material-ui/core/Button';

// Dummy文字
const DUMMY = '__D__';

const useStyles = makeStyles((theme) => ({
  line: { margin: '15px 5px' },
  valueLineAnalysisResult: {
    textAlign: 'left',
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
  valueLineOriginalText: { textAlign: 'left', whiteSpace: 'pre-wrap' },
  button: {
    width: '100px',
    height: '50px',
    position: 'absolute',
    left: 25,
    bottom: 0,
  },
  highlightWithOtherWordsRoot: { marginLeft: 4, marginBottom: 4 },
  highlightWithOtherWords: (colorInfo) => ({
    backgroundColor: `rgba(${colorInfo[0]},${colorInfo[1]},${colorInfo[2]},0.64)`,
  }),
  dictionaryTableRoot: { margin: 20 },
  dictionaryTableTitle: { paddingBottom: 5, fontWeight: 'bold' },
  dictionaryTable: {
    borderCollapse: 'collapse',
    width: '100%',
    wordWrap: 'break-word',
    tableLayout: 'fixed',
  },
  dictionaryTableTh: { width: 100, padding: 10, textAlign: 'left' },
  dictionaryTableTd: { padding: 10 },
}));

/**
 * 画面左側の解析結果を一括置換する
 * ナンバリング、ハイライト
 *
 * @param {string} value　解析結果…置換対象
 * @param {Arra} content ナンバリング済みのElementsの要素
 */
export function Line({ value, content }) {
  const classes = useStyles();
  let valueLine = value;
  if (Array.isArray(value)) {
    let pickupName = value.map((obj) => obj.name);
    valueLine = pickupName.join(', ');
  }

  Object.keys(content).map((key, i) => {
    if (Array.isArray(content[key])) {
      const contentCopy = JSON.parse(JSON.stringify(content[key]));
      contentCopy
      .sort((a, b) => lengthSort(a, b))
      .forEach((element) => {
        const otherWordsList = extractOtherWord(element.other_words);
        let otherWords = '';
        const colorInfo = element.optional_info || [0, 0, 0];
        if (element.name) {
          // 重複防止のためにダミー文字を入れる
          const escapedElementName = element.name.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
          const highlightTag = getHighlightTag({
            colorInfo,
            name: element.name,
            number: element.unique_index,
            otherWords: otherWords,
          });
          // 置換したhighlightTagをさらにDummy文字を付与して置換する
          const replacedHighlightTag = highlightTag.replace(/\b(\w+)\b/g, `${DUMMY}\$&${DUMMY}`);
          valueLine = valueLine.replaceAll(
            new RegExp('\\b' + escapedElementName + '\\b', 'g'),
            replacedHighlightTag
          );
          // 特殊文字が先頭かまたは末尾に含まれている場合、上の正規表現では置換されない
          // その場合、エスケープ後の文字列をそのまま置換する
          if (element.name.match(/^[\\^$.*+?()[\]{}|]|[\\^$.*+?()[\]{}|]$/)) {
            valueLine = valueLine.replaceAll(
              new RegExp(escapedElementName, 'g'),
              replacedHighlightTag
            );
          }
        }
        // otherWordの変換、かつ画面右側
        if (otherWordsList.length > 0) {
          otherWordsList.map((otherWord) => {
            const regExp = getRegExp(otherWord);
            const highlightTag = getHighlightTag({
              type: 'otherWord',
              colorInfo,
              name: element.name,
              number: element.unique_index,
              otherWord,
            });
            valueLine = valueLine.replaceAll(regExp, highlightTag);
          });
        }
      });
    }
  });

  // ダミー文字を消す
  valueLine = valueLine.replaceAll(DUMMY, '');

  return (
    <Grid
      container
      direction='column'
      justify='center'
      alignItems='flex-start'
      wrap='nowrap'
      spacing={2}
      className={classes.line}
      item
      xs={6}
      sm>
      <Grid
        container
        direction='row'
        justify='flex-start'
        alignItems='center'
        className={classes.valueLineOriginalText}>
        <div dangerouslySetInnerHTML={{ __html: valueLine }} style={{ width: '100%' }} />
      </Grid>
    </Grid>
  );
}

// 文字列が長い順にソート
function lengthSort(a, b) {
  const NumA = a.name.length;
  const NumB = b.name.length;
  return NumB - NumA;
}

// 文字列が短い順にソート
function lengthShortSort(a, b) {
  const NumA = a.name.length;
  const NumB = b.name.length;
  return NumA - NumB;
}

function extractOtherWord(otherWords) {
  if (otherWords && otherWords.length > 0) {
    let otherWordsList = otherWords.map((element) => element.name);
    otherWordsList = new Set(otherWordsList);
    return Array.from(otherWordsList);
  }
  return [];
}

function getHighlightTag({
  type = null,
  colorInfo,
  name,
  number,
  otherWords = null,
  otherWord = null,
}) {
  let tag = `<span style="background-color: rgba(${colorInfo[0]},${colorInfo[1]},${colorInfo[2]},0.64)">${name}${otherWords}</span><sup>[${number}]</sup>`;
  switch (type) {
    case 'otherWord':
      tag = `<span style="background-color: rgba(${colorInfo[0]},${colorInfo[1]},${colorInfo[2]},0.64)">${otherWord}</span><sup>[${number}]</sup>`;
      break;
    default:
      break;
  }
  return tag;
}

function getRegExp(element) {
  return new RegExp('\\b(?<!-)' + element + '\\b(?!-)', 'g');
}

export function ElementsContents({
  elementName,
  value,
  setOpen,
  setAnchorEl,
  setSelectedTextList,
  setSelectElementName,
}) {
  return (
    <div style={{ height: '100%' }}>
      {value &&
        value.map((element, i) => {
          const otherWordsList = extractOtherWord(element.other_words);
          let otherWords = otherWordsList.length > 0 ? ` ( ${otherWordsList.join(', ')} )` : '';
          const colorInfo = element.optional_info || [0, 0, 0];
          return (
            <div
              style={{ display: 'inline', float: 'left', wordBreak: 'break-all' }}
              onClick={(event) => {
                setSelectElementName(elementName);
                setSelectedTextList([element.name]);
                setAnchorEl(event.currentTarget);
                setOpen(true);
              }}
              key={`ElementsContents_${i}`}>
              <HighlightWithOtherWords
                colorInfo={colorInfo}
                element={element}
                otherWords={otherWords}
                hasComma={value.length - 1 !== i}
              />
            </div>
          );
        })}
    </div>
  );
}

function HighlightWithOtherWords({ colorInfo, element, otherWords, hasComma }) {
  const classes = useStyles(colorInfo);
  return (
    <Grid container direction='row' className={classes.highlightWithOtherWordsRoot}>
      <span className={classes.highlightWithOtherWords}>
        {element.name}
        {otherWords}
      </span>
      <sup>[{element.unique_index}]</sup>
      {hasComma && <div>,</div>}
    </Grid>
  );
}

/**
 * ナンバリング処理
 *
 * @param {Objects} elements
 */
export function addNumberInformation(elements) {
  let count = 0;
  let elementCopy = JSON.parse(JSON.stringify(elements));
  let numberedElement = {};
  ElementsOptions.map((key, i) => {
    const elementsKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    if (Array.isArray(elementCopy[elementsKey]) && elementCopy[elementsKey].length > 0) {
      elementCopy[elementsKey] = elementCopy[elementsKey].map((element) => {
        element.number = ++count;
        return element;
      });
      numberedElement[elementsKey] = elementCopy[elementsKey];
    }
  });
  return numberedElement;
}

/**
 *
 * @param {*} param0
 */
export function Menu({
  selectElementName,
  userId,
  open,
  anchorEl,
  handleClose,
  handleListKeyDown,
  selectedTextList,
  setSelectedText,
  setSelectedTextList,
  env,
}) {
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [apiType, setApiType] = useState(null);
  const openMenu = Boolean(anchorElMenu);
  const dispatch = useDispatch();

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  // TODO
  // 将来的に複数対応する予定
  const firstSelectedText = selectedTextList[0];

  return (
    <div style={{ zIndex: 100 }}>
      <Popper open={open} anchorEl={anchorEl} placement={'right-start'}>
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
              {!selectElementName && (
                <MenuItem
                  onClick={(event) => {
                    setAnchorElMenu(event.currentTarget);
                    setApiType('add');
                  }}>
                  <Grid
                    container
                    direction='row'
                    justifycontent='space-between'
                    alignItems='center'
                    style={{ width: '100%' }}>
                    <Grid item>Add "{firstSelectedText}"</Grid>
                    <Grid item></Grid>
                  </Grid>
                </MenuItem>
              )}
              <MenuItem
                onClick={async (event) => {
                  if (selectElementName) {
                    await dispatch(
                      fetchDictionay({
                        param: {
                          user_id: userId,
                          category: selectElementName.toLowerCase(),
                          words: selectedTextList,
                        },
                        apiType: 'delete',
                        env,
                      })
                    );
                    setSelectedText('');
                    setSelectedTextList([]);
                    setApiType(null);
                    return;
                  }
                  setAnchorElMenu(event.currentTarget);
                }}>
                <Grid
                  container
                  direction='row'
                  justifycontent='space-between'
                  alignItems='center'
                  style={{ width: '100%' }}>
                  <Grid item>Remove "{firstSelectedText}"</Grid>
                  <Grid item></Grid>
                </Grid>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
      <Popper open={openMenu} anchorEl={anchorElMenu} placement={'right-start'} transition>
        <Paper>
          <ClickAwayListener onClickAway={handleCloseMenu}>
            <MenuList autoFocusItem={openMenu} id='menu-list-grow' onKeyDown={handleListKeyDown}>
              {ElementsOptions.map((option) => (
                <MenuItem key={option} selected={option === 'AIRCRAFT'} onClick={handleCloseMenu}>
                  <div
                    onClick={async (event) => {
                      await dispatch(
                        fetchDictionay({
                          param: {
                            user_id: userId,
                            category: option.toLowerCase(),
                            words: selectedTextList,
                          },
                          apiType,
                          env,
                        })
                      );
                      setSelectedText('');
                      setSelectedTextList([]);
                      setApiType(null);
                    }}>
                    {option}
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
}

export function OpenFileDialogButton({ getRootProps, getInputProps, open, loading }) {
  const classes = useStyles();
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        size='small'
        variant='contained'
        color='primary'
        className={classes.button}
        disabled={loading}
        onClick={open}>
        Open File
      </Button>
    </div>
  );
}

export function DictionaryTable({ element, extracts, excludes }) {
  const classes = useStyles();

  return (
    <div className={classes.dictionaryTableRoot}>
      <div className={classes.dictionaryTableTitle}>{element}</div>
      <table border='1' className={classes.dictionaryTable}>
        <tbody>
          <tr>
            <th className={classes.dictionaryTableTh}>Extracts</th>
            <td className={classes.dictionaryTableTd}>{extracts}</td>
          </tr>
          <tr>
            <th className={classes.dictionaryTableTh}>Excludes</th>
            <td className={classes.dictionaryTableTd}>{excludes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
