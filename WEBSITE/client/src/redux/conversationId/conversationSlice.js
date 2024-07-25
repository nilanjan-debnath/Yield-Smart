import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentConversationId: null,
    error: null,
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        conversationIdSuccess: (state, action) => {
            state.currentConversationId = action.payload;
            state.error = null;
        },
        conversationIdFailure: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {conversationIdFailure, conversationIdSuccess} = conversationSlice.actions;
export default conversationSlice.reducer;