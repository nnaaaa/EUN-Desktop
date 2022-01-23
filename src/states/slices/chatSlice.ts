import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { arrayIsContain } from 'algorithms/array'
import { chatAPI } from 'api/rest'
import { IChatRoom } from 'models/chatRoom'
import { ID } from 'models/common'
import { IMessage } from 'models/message'
import { RootState } from 'states/store'

interface IinitalState {
    loading: boolean
    error?: string
    current: IChatRoom[]
}

const initialState: IinitalState = {
    loading: false,
    current: [],
}

const addChat = createAsyncThunk('chat/addOne', async (friendId: ID, thunkAPI) => {
    const user = (thunkAPI.getState() as RootState).user.current
    if (!user) throw new Error()
    const userId = user._id
    if (!userId) throw new Error()
    const room = await chatAPI.getRoom([userId, friendId])
    return room.data
})

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        closeWindowChat(state, action: PayloadAction<ID[] | ID>) {
            //tắt bằng id phòng
            if (typeof action.payload === 'string')
                state.current = state.current.filter(
                    (room) => room._id !== action.payload
                )
            //tắt bằng thành viên trong phòng
            else if (typeof action.payload === 'object')
                state.current = state.current.filter((room) => {
                    const listId = room.members.map((u) => u._id)
                    return !arrayIsContain(listId, ...action.payload)
                })
        },
        getMoreMessages(state, action: PayloadAction<{ messages: IMessage[], roomId: ID }>) {
            const { messages, roomId } = action.payload

            state.current = state.current.map((room) => {
                if (room._id === roomId) {
                    room.messages = room.messages.concat(messages)
                }
                return room
            })
        },
        insertMessage(state, action: PayloadAction<{ message: IMessage, roomId: ID }>) {
            const { message, roomId } = action.payload
            state.current = state.current.map((room) => {
                if (room._id === roomId) {
                    room.messages.unshift(message)
                }
                return room
            })
        },
        removeMessage(state, action: PayloadAction<{ messageId: ID; roomId: ID }>) {
            const { messageId, roomId } = action.payload
            state.current = state.current.map((room) => {
                if (room._id === roomId) {
                    room.messages = room.messages.filter(msg=>msg._id !== messageId)
                }
                return room
            })
        },
        clear(state) {
            state.current = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addChat.pending, (state) => {
                state.loading = true
            })
            .addCase(addChat.rejected, (state) => {
                state.loading = false
                state.error = 'Unauthorized'
            })
            .addCase(addChat.fulfilled, (state, action) => {
                state.loading = false
                state.current.push(action.payload)
            })
    },
})

const { reducer, actions } = chatSlice

export const chatActions = Object.assign(actions, {
    addChat,
})

export default reducer
