import React from 'react'
import {createRoot} from 'react-dom/client'
import {MemoryRouter, Route, Routes} from "react-router-dom";
import App from './App'
import Keys from './Keys'
import Config from "./Config";

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/keys" element={<Keys/>}/>
                <Route path="/config" element={<Config/>}/>
            </Routes>
        </MemoryRouter>
    </React.StrictMode>
)