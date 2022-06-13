import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Objects } from './scriptEngine/Objects';
import { Actions } from './scriptEngine/Actions';
import { Dictionary } from './scriptEngine/Dictionary';
import { ApiUrls } from '../utils/constants';

export default function Switcher() {
  const query = useQuery();
  const env = query.get('env') && ApiUrls[query.get('env')] ? query.get('env') : 'release';
  return (
    <Switch>
      <Route path='/objects/id/:userId' children={<Objects env={env} />} />
      <Route path='/objects'>
        <Objects env={env} />
      </Route>
      <Route path='/actions/id/:userId' children={<Actions env={env} />} />
      <Route path='/actions'>
        <Actions env={env} />
      </Route>
      <Route path='/dictionary/id/:userId' children={<Dictionary env={env} />} />
      <Route path='/dictionary'>
        <Dictionary env={env} />
      </Route>
      <Route path='/'>
        <Objects env={env} />
      </Route>
    </Switch>
  );
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
