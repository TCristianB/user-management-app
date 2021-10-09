import React, { useState } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import '../styles/Form.css'
import Header from '../components/Header'
import Notification from '../components/Notification'

const schema = yup.object().shape({
    email: yup.string().email().required('Email must be a valid email.'),
    password: yup.string().required('Password is a required field.')
})

const Login = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const { register, handleSubmit, formState: { errors } }  = useForm({
        resolver: yupResolver(schema)
    })
    const history = useHistory()

    const isLogged = JSON.parse(window.localStorage.getItem('isLogged'))


    const submitForm = async (data) => {
        try {
            await axios.post('/admin/sign-in', data)
                .then(() => {
                    window.localStorage.setItem('isLogged', JSON.stringify(true))
                })
            history.push('/home')
        } catch (e) {
            setErrorMessage('Email or password incorrect')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const logDemoAccount = async () => {
        const demoAccountData = {
            email: 'demo@example.com',
            password: 'demo'
        }
        try {
            await axios.post('/admin/sign-in', demoAccountData)
                .then(() => {
                    window.localStorage.setItem('isLogged', JSON.stringify(true))
                })
            history.push('/home')
        } catch (e) {
            setErrorMessage('Email or password incorrect')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    if (isLogged) {
        return <Redirect to="/home" />
    }

    return (
        <div className="form-container">
            <Header />
            {errorMessage && <Notification message={errorMessage}/>}
            <div className="container card p-4 bg-light form-container-card">
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            {...register('email', {required: 'Required'})}
                        />
                        {errors.email && <p className="mt-1 text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            {...register('password', {required: 'Required'})}
                        />
                        {errors.password && <p className="mt-1 text-danger">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary">Log In</button>
                    <p className="mt-3 mb-0">You do not have an account? <Link to="/register">Register</Link></p>
                </form>
                <button className="btn btn-primary mt-3" onClick={logDemoAccount}>Use a demo account</button>
            </div>
        </div>

    )
}

export default Login