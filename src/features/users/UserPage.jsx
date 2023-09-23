import { useSelector } from "react-redux"
import { selectUserById } from "./usersSlice"
import { selectPostByUser } from "../posts/postsSlice"
import { Link } from "react-router-dom"

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))

  // const postsForUser = useSelector(state => {
  //   // agregando logica compleja para recuperar
  //   // useSelector se usa para redibujar el componente
  //   // en caso que se retorne una nueva referencia
  //   const allPosts = selectAllPosts(state)
  //   // retorna solo los posts de este usuario
  //   // entonces useSelector siempre retorna una nueva referncia
  //   // LO QUE DEBERIAS DE VERIFICAR ES QUE ESTE COMPONENTE SOLO
  //   // SE REDIBUJE CUANDO cambie, los posts o userId
  //   return allPosts.filter(post => post.user === userId)
  // })

  const postsForUser = useSelector(state => selectPostByUser(state, userId))
  console.log({ userId, user, postsForUser })

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
