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
    username: yup.string().required('Username is a required field.'),
    name: yup.string().required('Name is a required field.'),
    email: yup.string().email().required('Email must be a valid email.'),
    password: yup.string().required('Password is a required field.'),
})


const Register = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const { register, handleSubmit, formState: { errors } }  = useForm({
        resolver: yupResolver(schema)
    })
    const isLogged = JSON.parse(window.localStorage.getItem('isLogged'))
    const history = useHistory()


    const submitForm = async (data) => {
        try {
            await axios.post('/admin/sign-up', data, { withCredentials: true })
                .then(() => {
                    window.localStorage.setItem('isLogged', JSON.stringify(true))
                    history.push('/home')
                })
        } catch (e) {
            if(e.response.status === 409) {
                setErrorMessage('Email already exists')
            } else {
                setErrorMessage('Bad request')
            }
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
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            {...register('username', {required: 'Required'})}
                        />
                        {errors.username && <p className="mt-1 text-danger">{errors.username.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            {...register('name', {required: 'Required'})}
                        />
                        {errors.name && <p className="mt-1 text-danger">{errors.name.message}</p>}
                    </div>
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
                    <button type="submit" className="btn btn-primary">Create account</button>
                    <p className="mt-3 mb-0">Already have an account? <Link to="/login">Log In</Link></p>
                </form>
            </div>
        </div>

    )
}

export default Register