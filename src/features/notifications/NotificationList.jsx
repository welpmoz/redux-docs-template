import { useDispatch, useSelector } from "react-redux"
import { allNotificationsRead, selectAllNotifications } from "./notificationsSlice"
import { selectAllUsers } from "../users/usersSlice"
import { formatDistanceToNow, parseISO } from "date-fns"
import { useLayoutEffect } from "react"
import classNames from "classnames"

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  useLayoutEffect(() => {
    // se ejecuta luego de la primera renderizacion
    dispatch(allNotificationsRead()) // se maneja por el slice
  })

  const rederedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }

    const notificationClassname = classNames('notification', {
      new: notification.isNew
    })

    return (
      <div className={notificationClassname} key={notification.id}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {rederedNotifications}
    </section>
  )
}



