import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
  'notificacions/fetchNotifications',
  // el primer argumento, sera el payload del dispatch
  async(_, { getState }) => {
    // segundos argumentos: dispatch, getState, extra
    const allNotifications = selectAllNotifications(getState()) // recuperamos las notifaciones
    const [latesNotification] = allNotifications // recuperar la ultima notifiacion
    const latestTimestamp = latesNotification ? latesNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificacionsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    // allNotificationsRead(state, action) {
    //   state.forEach(notification => {
    //     notification.read = true
    //   })
    // }
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      // convertir en arreglo los objetos
      Object.values(state.entities).forEach(notification => {
        // cualquier notificacion leida no es nueva
        notification.isNew = !notification.read
      })
    })
    // builder.addCase(fetchNotifications.fulfilled, (state, action) => {
    //   state.push(...action.payload) // agregar cada notificacion
    //   state.forEach(notification => {
    //     // las notificaciones leidas no son nuevas
    //     notification.isNew = !notification.read
    //   })
    //   // ordenar
    //   state.sort((a, b) => b.date.localeCompare(a.date))
    // })
  }
})

export const { allNotificationsRead } = notificacionsSlice.actions

export default notificacionsSlice.reducer

export const {
  selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)
// export const selectAllNotifications = state => state.notifications
