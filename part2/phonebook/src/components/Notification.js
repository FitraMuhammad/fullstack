const Notification = ({message}) => {
    if(message === null){
        return null
    }

    return (
        <div className={`notification notification_${message.status}`}>
            {message.text}
        </div>
    )
}

export default Notification