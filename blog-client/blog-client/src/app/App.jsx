import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import AppLayout from "../layout/AppLayout";




export default function App() {
	return (
		<BrowserRouter>
		<AppLayout>
			<Router />
		</AppLayout>
		</BrowserRouter>
	);
}
