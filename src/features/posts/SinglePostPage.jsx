import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { PostAuthor } from "../users/PostAuthor"
import { TimeAgo } from "./TimeAge"
import { ReactionButtons } from "./ReactionButtons"
import { selectPostById } from "./postsSlice"

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  // el componente se volvera a renderizar cada vez que la
  // referencia de useSelector cambie a otro
  // const post = useSelector(state => state.posts.find(post => post.id === postId))
  const post = useSelector(state => selectPostById(state, postId))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date}/>
      </div>
      <div>
        <ReactionButtons post={post} />
      </div>
    </section>
  )
}



