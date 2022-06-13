import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Switcher from './features/Switcher';
import { Provider } from 'react-redux';
import { store } from './store';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    height: '100vh',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Router>
        <div className={classes.root}>
          <Switcher />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
