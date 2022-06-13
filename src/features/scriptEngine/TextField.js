import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Line, addNumberInformation } from '../../components/molecules';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { ElementsOptions } from '../../utils/constants';
import { fetchDictionay } from '../../store/slice/dictionarySlice';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles({
  cardContent: {
    height: '89vh',
    width: '100%',
    overflow: 'auto',
  },
  textArea: {
    height: '89vh',
    width: '100%',
  },
});

export function TextField({ content, env }) {
  const classes = useStyles();
  return (
    <Grid container item xs>
      <Card className={classes.cardContent} variant='outlined'>
        <CardContent>
          <Contents content={content} env={env} />
        </CardContent>
      </Card>
    </Grid>
  );
}

function Contents({ content, env }) {
  const { userId } = useParams();
  const [selectedText, setSelectedText] = useState('');
  const [selectedTextList, setSelectedTextList] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnMouseUp = () => {
    if (!userId) {
      return;
    }
    if (selectedText) {
      setSelectedTextList([selectedText]);
      setSelectedText('');
      setOpen(true);
      const selection = document.getSelection();
      const getBoundingClientRect = () => selection.getRangeAt(0).getBoundingClientRect();
      setAnchorEl({
        clientWidth: getBoundingClientRect().width,
        clientHeight: getBoundingClientRect().height,
        getBoundingClientRect,
      });
    }
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('selectionchange', (event) => {
      if (open || !userId) {
        return;
      }

      const selection = document.getSelection();
      setSelectedText(selection.toString().trim());

      if (!selection || !selectedText) {
        handleClose();
        return;
      }
    });
    return () => {
      document.removeEventListener('selectionchange', () => {});
    };
  }, []);

  if (!content) {
    return <></>;
  }

  const addNumberElements = (content || {}).Elements ? addNumberInformation(content.Elements) : {};

  return (
    <div onMouseLeave={handleClose} ref={ref} onMouseUp={handleOnMouseUp}>
      <Line value={content.input} content={addNumberElements} />;
      <Menu
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
  );
}

function Menu({
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
    <>
      <Popper open={open} anchorEl={anchorEl} placement={'right-start'}>
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
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
              <MenuItem
                onClick={(event) => {
                  setAnchorElMenu(event.currentTarget);
                  setApiType('delete');
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
    </>
  );
}
