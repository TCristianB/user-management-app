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
    name: yup.string().required('Username is a required field.'),
    email: yup.string().required('Email is a required field.'),
    status: yup.string().required()
})

const AddUser = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const isLogged = JSON.parse(window.localStorage.getItem('isLogged'))
    const history = useHistory()

    const submitForm = async (data) => {
        try {
            await axios.post('/users/sign-up', data, { withCredentials: true })

            history.push('/home')
        } catch (e) {
            if (e.response.status === 409) {
                setErrorMessage('An user with that email already exists')
            } else {
                setErrorMessage('Bad request')
            }
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    if (!isLogged) {
        return <Redirect to="/login" />
    }

    return (
        <div className="form-container">
            <Header />
            <Notification message={errorMessage} />
            <div className="container card p-4 bg-light form-container-card">
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            {...register('name', { required: 'Required' })}
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
                            {...register('email', { required: 'Required' })}
                        />
                        {errors.email && <p className="mt-1 text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="mb-1 radio-container">
                        <label className="form-label">Status</label><br />
                        <div className="radio-container__option">
                            <input
                                type="radio"
                                name="status"
                                value="active"
                                {...register('status', { required: 'Required' })}
                            />
                            <label className="radio-label">Active</label>
                        </div>
                        <div className="radio-container__option">
                            <input
                                type="radio"
                                name="status"
                                value="inactive"
                                {...register('status', { required: 'Required' })}
                            />
                            <label className="radio-label">Inactive</label>
                        </div>
                    </div>
                    {errors.status && <p className="mb-3 text-danger">Status is required</p>}
                    <button type="submit" className="btn btn-primary mb-2 mt-2">Create user</button><br />
                    <Link to="/home" className="mb-2">Go back</Link>
                </form>
            </div>
        </div>

    )
}

export default AddUser