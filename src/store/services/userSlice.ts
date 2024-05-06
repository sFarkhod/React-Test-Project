import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  key: string;
  secret: string;
}

const initialState: UserState = {
  key: '',
  secret: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setKey: (state, action: PayloadAction<string>) => {
      state.key = action.payload;
    },
    setSecret: (state, action: PayloadAction<string>) => {
      state.secret = action.payload;
    },
  },
});

export const { setKey, setSecret } = userSlice.actions;

export default userSlice.reducer;