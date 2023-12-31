import { useSelector } from "react-redux"
import { selectUserById } from "./usersSlice"

export const PostAuthor = ({ userId }) => {
  //const author = useSelector(state => state.users.find(user => user.id === userId))
  const author = useSelector(state => selectUserById(state, userId))

  return <span>by {author ? author.name : 'Unknow author'}</span>
}
