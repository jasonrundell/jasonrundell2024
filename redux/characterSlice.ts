import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from '../types/Character';

const initialState: Character | null = null;

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    selectCharacter(state, action: PayloadAction<Character>) {
      return action.payload;
    },
    resetCharacter() {
      return null;
    },
  },
});

export const { selectCharacter, resetCharacter } = characterSlice.actions;
export default characterSlice.reducer;
