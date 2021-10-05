import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import '../styles/Home.css'
import Header from '../components/Header'
import Table from '../components/Table'
import Notification from '../components/Notification'

const Home = () => {
    const [users, setUsers] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    const isLogged = JSON.parse(window.localStorage.getItem('isLogged'))

    useEffect(() => {
        let isMounted = true
        axios.get('/users', { withCredentials: true })
            .then(res => {
                if (isMounted) {
                    setUsers(res.data)
                    setIsPending(false)
                }
                return null
            }).catch(e => {
                setIsPending(false)
            })
        return () => { isMounted = false }
    }, [])

    const logoutAdmin = async () => {
        try {
            await axios.post('/admin/sign-out')
                .then(() => {
                    window.localStorage.removeItem('isLogged')
                })
        } catch (e) {
            setErrorMessage('Internal Server Error')
        }
    }

    if (!isLogged) {
        return <Redirect to="/login" />
    }

    return (
        <div>
            <Header />
            <div className="mb-3">
                <Link to="/add-user" className="btn btn-primary">Add user</Link>
            </div>
            <div>
                <Table users={users} setUsers={setUsers} isPending={isPending} />
            </div>
            <div className="mt-3">
                <Link to="/login" onClick={logoutAdmin}>Logout</Link>
                {errorMessage && <Notification message={errorMessage} />}
            </div>
        </div>
    )
}

export default Home