import React from "react";
import "./style.css";
import { Header, Footer } from "./components";
import Main from "./content/Main";

// Example functional component structure for your app
function App() {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    );
}

export default App;