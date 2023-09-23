
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, nanoid } from "@reduxjs/toolkit"
import { client } from "../../api/client";

// const initialState = [
//   {
//     id: '1',
//     title: 'First Post!',
//     content: 'Hello!',
//     user: '0',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
//   },
//   {
//     id: '2',
//     title: 'Second Post',
//     content: 'More text',
//     user: '2',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
//   },
// ]

// normalizando los datos
// sabemos que queremos guardar los posts ordenados
// por ids, por eso pasamos el comparador de fecha
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// getInitialState retorna por defecto {ids: [], entities: {}}
// si queremos mas datos, lo agregamos como objetos
// nuestros posts ahora se encuentran en state.entities
const initialState = postsAdapter.getInitialState({
  // posts: [],
  status: 'idle',
  error: null
})

// logica asincrona, recibe 2 argumentos
// 1. string que se usara como prefijo para generar acciones
// 2. una funcion creadora de payload que retornara una promesa
// conteniendo alguna data a un promesa con error
// Estas funciones creadas con asyncthunk tienen estados
// pending, y fullfilled 
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() => {
  // normalmente realizamos una peticion ajax en aca
  const response = await client.get('/fakeApi/posts')
  return response.data // para payload de nuestra accion
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
  // el callback recibe un objeto {title, content, user}
  const response = await client.post('/fakeApi/posts', initialPost)
  // la respuesta incluye el objeto completo con un ID unico
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  // yo me encargo solo del estado posts, es decir
  // mi contenido sera el arreglo de posts
  reducers: {
    postAdded: {
      reducer(state, action) {
        // state hace referencia al objeto inicial
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(), // almacenamos en string
            title,
            content,
            user: userId
          }
        }
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // const existingPost = state.posts.find(post => post.id === id)
      const existingPost = state.entities[id]
      if (existingPost) {
        // si existe el post, actualizamos el estado
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      // state = {ids:[], entities: {}}
      const existingPost = state.entities[postId]
      //const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  },
  extraReducers(builder) {
    // nos sirve para construir una serie de respuestas
    // a otras funciones que estan fuera del slice
    // ya que en el slice no existe funciones asincronas
    builder
      // el thunk puede servir estos 3 tipos de acciones
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // funcion utilitaria de la libreria, para agregar
        // varios datos. Objetos que se repiten se juntan
        // basados en su id
        postsAdapter.upsertMany(state, action.payload)
        // agregar cualquier post retornado
        // action payload lo que se retorna de thunk
        // state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // agregar otros casos para otro thunk
      // .addCase(addNewPost.fulfilled, (state, action) => {
      //   // action.payload es lo que retorna la funcion thunk
      //   state.posts.push(action.payload)
      // })
      // agregar un objeto a nuestro store
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  }
})

// podemos hacer dispatch del estado con las funciones reducer
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer // this reducer function must be added to the store

// exportar los selectores personalizados
export const {
  // cambiando de nombres
  selectAll: selectAllPost,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => state.posts) // pasamos un selector para saber que dato es

// selectores, hacen referencia al json mas general del estado
// export const selectAllPosts = state => state.posts.posts
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

// seelctor memoizado
// selectPostByUser(state, userId)
// necesitamos el arreglo de los posts y un id de usuario
// posts, idUser los 2 argumentos para el output selector
// solo se redibuja si el resultado del selector de entrada
// cambia
export const selectPostByUser = createSelector(
  // input selector, selector de userId
  [selectAllPost, (state, userId) => userId], // lo que retorna es la entrada para el output selector
  // output selector
  (posts, userId) => posts.filter(post => post.user === userId)
)
