import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { PostAuthor } from "../users/PostAuthor"
import { TimeAgo } from "./TimeAge"
import { ReactionButtons } from "./ReactionButtons"
import { fetchPosts, selectPostById, selectPostIds } from "./postsSlice"
import React, { useEffect } from "react"
import { Spinner } from "../../components/Spinner";

let PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  // para que un componente react acceda al store
  // usamos el metodo useSelector que recibe un selector
  // const posts = useSelector(state => state.posts)
  // funciones selectoras
  // const posts = useSelector(selectAllPost)
  // dispatch tambien se usa para servir thunks
  const dispatch = useDispatch()
  // usar el adaptador
  const orderedPostIds = useSelector(selectPostIds)

  // estado de la recuperacion de datos
  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  // fetch data when postlist is mounted
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
      // como el metodo sort muta el arreglo, necesitamos hacer una copia
      // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
      // content = orderedPosts.map(post => (
      //   <PostExcerpt key={post.id} post={post} />
      // ))
      content = orderedPostIds.map(postId => (
        <PostExcerpt key={postId} postId={postId} />
      ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
