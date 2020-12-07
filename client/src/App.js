import React from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Signup />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
