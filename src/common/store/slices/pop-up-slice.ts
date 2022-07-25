import { createSlice } from "@reduxjs/toolkit";

const popUpSlice = createSlice({
	name: "popUp",
	initialState: {
		show: false,
		type: ""
	},
	reducers: {
		showModal(state, { payload }) {
			state.show = true;
			state.type = payload[0]
		},
		hideModal(state) {
			state.show = false;
			state.type = ""
		}
	}
});

export default popUpSlice.reducer;
export const popUpActions = popUpSlice.actions;
