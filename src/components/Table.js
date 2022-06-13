import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Line, ElementsContents, addNumberInformation } from './molecules';
import { ElementsKeyList } from '../utils/constants';
import { Menu } from './molecules';
import { useParams } from 'react-router-dom';
import { fetchDictionay } from '../store/slice/dictionarySlice';

const useStyles = makeStyles({
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    wordWrap: 'break-word',
    tableLayout: 'fixed',
  },
  tableLineTh: {
    textAlign: 'left',
    backgroundColor: '#dcdcdc',
    border: 'solid 1px black',
    height: '28px',
  },
  tableLineTd: {
    border: 'solid 1px black',
    verticalAlign: 'top',
    width: '100%',
    verticalAlign: 'top',
  },
  tableLineTdOnFocus: {
    border: 'solid 1px black',
    verticalAlign: 'top',
    backgroundColor: '#cee7fd',
    width: '100%',
    verticalAlign: 'top',
  },
  tableTr: { height: '28px' },
  elementsKey: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 'small',
    lineHeight: 0,
  },
  sceneTableLineTh: {
    textAlign: 'center',
    backgroundColor: '#dcdcdc',
    border: 'solid 1px black',
    height: '28px',
  },
  sceneTableLeft: { width: '50%', verticalAlign: 'top' },
  titleLine: { marginLeft: '5px' },
  sceneSubTitle: {
    fontSize: 'xx-small',
    margin: 0,
  },
  sceneTableRight: { width: '16%', textAlign: 'center', verticalAlign: 'top' },
  blankTd: {
    height: '28px',
  },
  elementsTd: { width: '100%', verticalAlign: 'top' },
  elements: { padding: 4, overflow: 'auto' },
  brands: { height: '28px', padding: 4, overflow: 'auto' },
});

export default function Table({ content, env }) {
  return (
    <>
      <Scene content={content} />
      <Chracters content={content} />
      <ShootingTime />
      <ScriptReport />
      <Elements content={content} env={env} />
      <Brands content={content} />
    </>
  );
}

function Scene({ content }) {
  const LOCATION = (content || {}).location || '-';
  const LOCATION_STUDIO = (content || {})['Location/Studio'] || '-';
  const INTERIOR_EXTERIOR = (content || {})['Interior/Exterior'] || '-';
  const DAY_NIGHT = (content || {}).Time || '-';
  const DESCRIPTION = ((content || {}).Words || {}).description || '-';
  const ACTION = ((content || {}).Words || {}).action || '-';
  const DIALOGUE = ((content || {}).Words || {}).dialogue || '-';
  const classes = useStyles();
  return (
    <table border='1' className={classes.table}>
      <colgroup>
        <col className={classes.sceneTableLeft} />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <th colSpan='13' className={classes.sceneTableLineTh}>
            SCENE
          </th>
        </tr>
        <tr className={classes.tableTr}>
          <td colSpan='1' className={classes.sceneTableLeft}></td>
          <td colSpan='6'></td>
          <td colSpan='6'></td>
        </tr>
        <tr className={classes.tableTr}>
          <td className={classes.sceneTableLeft}>
            <div className={classes.titleLine}>
              <p className={classes.sceneSubTitle}>LOCATION</p>
              <span>{LOCATION}</span>
            </div>
          </td>
          <td colSpan='4' className={classes.sceneTableRight}>
            <div>
              <p className={classes.sceneSubTitle}>LOCATION/STUDIO</p>
              <span>{LOCATION_STUDIO}</span>
            </div>
          </td>
          <td colSpan='4' className={classes.sceneTableRight}>
            <div>
              <p className={classes.sceneSubTitle}>INTERIOR/EXTERIOR</p>
              <span>{INTERIOR_EXTERIOR}</span>
            </div>
          </td>
          <td colSpan='4' className={classes.sceneTableRight}>
            <div>
              <p className={classes.sceneSubTitle}>DAY/NIGHT</p>
              <span>{DAY_NIGHT}</span>
            </div>
          </td>
        </tr>
        <tr className={classes.tableTr}>
          <td className={classes.sceneTableLeft}></td>
          <td colSpan='4' className={classes.sceneTableRight}>
            <div>
              <p className={classes.sceneSubTitle}>DESCRIPTIONS</p>
              <span>{DESCRIPTION}</span>
            </div>
          </td>
          <td colSpan='4' className={classes.sceneTableRight}>
            <div>
              <p className={classes.sceneSubTitle}>ACTIONS</p>
              <span>{ACTION}</span>
            </div>
          </td>
          <td colSpan='4' className={classes.sceneTableRight}>
            <div>
              <p className={classes.sceneSubTitle}>DIALOGUES</p>
              <span>{DIALOGUE}</span>
            </div>
          </td>
        </tr>
        <tr className={classes.tableTr}>
          <td colSpan='13'></td>
        </tr>
      </tbody>
    </table>
  );
}

function Chracters({ content }) {
  const characters = (content || {}).Characters;
  const classes = useStyles();
  if (!characters) {
    return <></>;
  }

  return (
    <table border='1' className={classes.table}>
      <tbody>
        <tr>
          <th className={classes.tableLineTh}>
            <div className={classes.titleLine}>CHARACTERS</div>
          </th>
        </tr>
        <tr>
          <td className={classes.blankTd}>
            <Line value={characters} content={characters} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ShootingTime() {
  const classes = useStyles();
  return (
    <table border='1' className={classes.table}>
      <tbody>
        <tr>
          <th className={classes.tableLineTh}>
            <div className={classes.titleLine} style={{ visibility: 'hidden' }}>
              SHOOTING TIME
            </div>
          </th>
        </tr>
        <tr>
          <td className={classes.blankTd}></td>
        </tr>
      </tbody>
    </table>
  );
}

function Brands({ content }) {
  const classes = useStyles();
  const brands = (content || {}).Brands || [];
  const brandsNameList = brands.map((brand) => {
    return brand.name + " ( " + brand.other_words.join(", ") + " )";
  });
  const brandsLine = brandsNameList.join(', ');

  return (
    <table border='1' className={classes.table}>
      <tbody>
        <tr>
          <th className={classes.tableLineTh}>
            <div className={classes.titleLine}>BRANDS</div>
          </th>
        </tr>
        <tr>
          <td className={classes.brands}>{brandsLine}</td>
        </tr>
      </tbody>
    </table>
  );
}

function ScriptReport() {
  const classes = useStyles();
  return (
    <table border='1' className={classes.table}>
      <tbody>
        <tr>
          <th className={classes.tableLineTh}>
            <div className={classes.titleLine} style={{ visibility: 'hidden' }}>
              SCRIPT REPORT
            </div>
          </th>
        </tr>
        <tr>
          <td className={classes.blankTd}></td>
        </tr>
      </tbody>
    </table>
  );
}

function Elements({ content, env }) {
  const elements = (content || {}).Elements;
  const classes = useStyles();
  const addNumberElements = elements ? addNumberInformation(elements) : {};
  const { userId } = useParams();
  const [selectedText, setSelectedText] = useState('');
  const [selectedTextList, setSelectedTextList] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectElementName, setSelectElementName] = useState(null);
  const [onFocus, setOnFocus] = useState(false);
  const [onFocusElement, setOnFocusElement] = useState(null);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <table border='1' className={classes.table}>
      <tbody>
        <tr>
          <th colSpan='4' className={classes.tableLineTh}>
            <div className={classes.titleLine}>ELEMENTS</div>
          </th>
        </tr>
        {ElementsKeyList.map((line, i) => {
          return (
            <tr key={`tr_${i}`}>
              {line.map((key) => {
                return (
                  <td
                    colSpan={key === 'Props' ? 4 : 1}
                    className={
                      onFocus && key == onFocusElement
                        ? classes.tableLineTdOnFocus
                        : classes.tableLineTd
                    }
                    key={`td_${key}`}
                    onDragOver={() => {
                      if (userId) {
                        setOnFocus(true);
                        setOnFocusElement(key);
                      }
                    }}
                    onDragLeave={() => {
                      if (userId) {
                        setOnFocus(false);
                      }
                    }}
                    onDrop={async (event) => {
                      setOnFocus(false);
                      if (userId) {
                        const droptxt = event.dataTransfer.getData('text/plain').trim();
                        dispatch(
                          fetchDictionay({
                            param: {
                              user_id: userId,
                              category: key.toLowerCase(),
                              words: [droptxt], // TODO
                            },
                            apiType: 'add',
                            env,
                          })
                        );
                      }
                    }}>
                    <p className={classes.elementsKey}>{key.toUpperCase()}</p>
                    {addNumberElements && addNumberElements[key] ? (
                      <div className={classes.elements}>
                        <ElementsContents
                          elementName={key}
                          value={addNumberElements[key]}
                          setOpen={setOpen}
                          setAnchorEl={setAnchorEl}
                          setSelectedTextList={setSelectedTextList}
                          setSelectElementName={setSelectElementName}
                        />
                        <Menu
                          selectElementName={selectElementName}
                          userId={userId}
                          open={open}
                          anchorEl={anchorEl}
                          handleClose={handleClose}
                          handleListKeyDown={handleListKeyDown}
                          selectedTextList={selectedTextList}
                          setSelectedText={setSelectedText}
                          setSelectedTextList={setSelectedTextList}
                          env={env}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
