import {createSlice} from "@reduxjs/toolkit";

export interface UnitState {
    value: number,
    unitShape: string | null,
}

const initialState: UnitState = {value: 1, unitShape: null}

interface SetUnitAction {
    value: number,
    id: string | null,
}

const unitSlice = createSlice({
    name: "unit",
    initialState,
    reducers: {
        setUnit(state, action: { payload: SetUnitAction }) {
            state.value = action.payload.value;
            state.unitShape = action.payload.id;
        },
        resetUnit(state) {
            state.value = 1;
            state.unitShape = null;
        }
    }
})

export const {setUnit, resetUnit} = unitSlice.actions;
export default unitSlice.reducer;