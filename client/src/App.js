import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AddUser from './pages/AddUser'

function App() {
    const [admin, setAdmin] = useState(null)

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>
                <Route default path="/login" component={Login}></Route>
                <Route exact path="/register" component={() => <Register admin={admin} setAdmin={setAdmin} />}></Route>
                <Route exact path="/home" component={() => <Home admin={admin} setAdmin={setAdmin} />}></Route>
                <Route exact path="/add-user" component={AddUser}></Route>
            </Switch>
        </Router>

    );
}

export default App
