import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Router />
			<Footer />
		</BrowserRouter>
	);
}
