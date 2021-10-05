import React, { useState } from 'react'
import axios from 'axios'

import '../styles/Form.css'

const UpdateUser = ({ trigger, setTrigger, userUpdate }) => {
    const { id, name, email } = userUpdate
    const [data, setData] = useState({
        name,
        email,
        status: 'inactive'
    })

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault(e)
        await axios.patch(`/users/${id}`, data, { withCredentials: true })
            .then(() => {
                window.location.reload()
                setTrigger(false)
            })
    }

    return (trigger) ? (
        <div className="form-container popup-container">
            <div className="container card p-4 bg-light form-container-card">
                <form onSubmit={handleSubmit}>
                    <div className="close-container">
                        <i className="fas fa-times fa-2x" onClick={() => setTrigger(false)}></i>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            defaultValue={name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            defaultValue={email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3 radio-container">
                        <label className="form-label">Status</label><br />
                        <div className="radio-container__option">
                            <input
                                type="radio"
                                name="status"
                                defaultValue="Active"
                                onChange={handleInputChange}
                            />
                            <label className="radio-label">Active</label>
                        </div>
                        <div className="radio-container__option">
                            <input
                                type="radio"
                                name="status"
                                defaultValue="Inactive"
                                onChange={handleInputChange}
                            />
                            <label className="radio-label">Inactive</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mb-2">Update</button>
                </form>
            </div>
        </div>
    ) : <></>;
}

export default UpdateUser