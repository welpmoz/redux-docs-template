import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { client } from "../../api/client"

const usersAdapter = createEntityAdapter()

// retorna un objeto {ids:[], entities:{}}
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async() => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // .addCase(fetchUsers.fulfilled, (state, action) => {
      //   // otra forma de actualizar el estado
      //   // retornando un nuevo valor para el estado
      //   return action.payload
      // })
      // setear los datos con el payload de thunk
      .addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  }
})

export default usersSlice.reducer

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById
} = usersAdapter.getSelectors(state => state.users)

// export const selectAllUsers = state => state.users

// export const selectUserById = (state, userId) => state.users.find(user => user.id === userId)
