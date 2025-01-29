import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ComparisonState {
  pr_ids: string[];
}

const initialState: ComparisonState = {
  pr_ids: [],
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison(state, action: PayloadAction<string>) {
      // Add a product ID only if it doesn't already exist and limit to 3 products
      if (!state.pr_ids.includes(action.payload) && state.pr_ids.length < 3) {
        state.pr_ids.push(action.payload);
      }
    },
    removeFromComparison(state, action: PayloadAction<string[]>) {
      state.pr_ids = state.pr_ids.filter(id => !action.payload.includes(id));
    },
    clearComparison(state) {
      state.pr_ids = [];
    },
  },
});

export const {addToComparison, removeFromComparison, clearComparison} =
  comparisonSlice.actions;

export const selectComparisonProducts = (state: {
  comparison: ComparisonState;
}) => state.comparison.pr_ids;

export default comparisonSlice.reducer;
