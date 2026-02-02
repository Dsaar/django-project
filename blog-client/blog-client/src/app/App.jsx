import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Navbar from "../components/Navbar";

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Router />
		</BrowserRouter>
	);
}
