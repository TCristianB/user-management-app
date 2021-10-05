import React from 'react'

const Notification = ({ message }) => {
    return (
        <div>
            <p className="mb-2 text-danger">{message}</p>
        </div>
    )
}

export default Notification