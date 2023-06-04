import React, { useState } from 'react'
import { Toast, ToastBody, ToastHeader } from 'reactstrap'



const Notification = ({ heading, message }) => {
    const [showToast, setToast] = useState(true)

    return (
        <div>
            <Toast isOpen={showToast} onClose={setToast(false)}>
                <ToastHeader toggle={this.dismissToast}>{heading}</ToastHeader>
                <ToastBody>{message}</ToastBody>
            </Toast>
        </div>
    )
}

export default Notification