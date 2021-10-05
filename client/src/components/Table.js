import React, { useState } from 'react'
import UpdateUser from '../components/UpdateUser'
import axios from 'axios'

const Table = ({ users, setUsers, isPending }) => {
    const [update, setUpdate] = useState(false)
    const [userUpdate, setUserUpdate] = useState({})

    const updateUser = (id, name, email, status) => {
        setUpdate(true)
        setUserUpdate({
            id,
            name,
            email,
            status
        })
    }

    const deleteUser = async (id) => {
        await axios.delete(`/users/${id}`)
            .then(() => {
                setUsers(users.filter((user) => {
                    return user._id !== id
                }))
            })
    }

    if(isPending) {
        return (
            <h3>Loading...</h3>
        )
    }

    if (users.length < 1) {
        return (
            <h3>There is no users</h3>
        )
    }
    
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {!isPending && users.map((user, index) => {
                        const { _id, name, email, status } = user
                        return (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{name}</td>
                                <td>{email}</td>
                                <td>{status}</td>
                                <td>
                                    <i className="fas fa-edit update-icon" onClick={() => updateUser(_id, name, email, status)}></i>
                                    <i onClick={() => deleteUser(_id)} className="fas fa-trash-alt"></i>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <UpdateUser trigger={update} setTrigger={setUpdate} userUpdate={userUpdate} setUsers={setUsers} users={users}/>
        </>
    )
}

export default Table