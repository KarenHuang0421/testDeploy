import { createSlice } from "@reduxjs/toolkit";

const popUpSlice = createSlice({
	name: "popUp",
	initialState: {
		show: false,
		type: "",
		content: ""
	},
	reducers: {
		showModal(state, { payload }) {
			state.show = true;
			state.type = payload[0]

			if (payload[0] === 'confirm') {
				state.content = payload[1]
			}
		},
		hideModal(state) {
			state.show = false;
			state.type = ""
		}
	}
});

export default popUpSlice.reducer;
export const popUpActions = popUpSlice.actions;
