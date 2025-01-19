import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./Layout";

function App() {
	return (
		<div className="w-screen">
			<Layout>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
					</Routes>
				</BrowserRouter>
			</Layout>
		</div>
	);
}

export default App;
