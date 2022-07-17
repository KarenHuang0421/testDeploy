import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import moment from "moment";

import App from "./App";
import store from "./common/store";

import 'moment/locale/zh-tw'
moment.locale('zh-tw')

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ReduxProvider store={store}>
				<App />
			</ReduxProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
