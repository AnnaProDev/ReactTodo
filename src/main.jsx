import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
<<<<<<< HEAD
import {BrowserRouter} from 'react-router';
import "./index.css";
=======
import "./styles/global.css";
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
