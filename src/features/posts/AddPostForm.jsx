import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addNewPost } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"


export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  // estado de carga
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  // use dispatch para notificar al store algun cambio
  const dispatch = useDispatch()

  // recuperar el slice de usuarios
  const users = useSelector(selectAllUsers)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)

  // logica simple de validacion
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onSavePostClicked = async() => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        // dispatch de un thunk retorna una promesa
        // unwrap() tiene el valor de action.payload al hacer fulfilled
        const r = await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        console.log(JSON.stringify(r))
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value="" />
          {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave} >
          Save Post
        </button>
      </form>
    </section>
  )
}