import Head from "./Head";
import {useState} from "react";
import {AddKey, FilePrompt, IsOnline, RequestPath, StartFile} from "../wailsjs/go/main/App";
import "./assets/App.css"
import {TextField} from "@mui/material";

function App() {
    let [key, setKey] = useState("")
    let [startDisabled, setStartDisabled] = useState(false)
    let [stopDisabled, setStopDisabled] = useState(false)
    let [error, setError] = useState(false)

    async function startCallback() {
        setStartDisabled(true)
        if (!await IsOnline()) {
            StartFile()
        } else {
            alert("KeyboardSoundPlayer is already started")
        }
        setStartDisabled(false)
    }

    async function stopCallback() {
        setStopDisabled(true)
        if (await IsOnline()) {
            await RequestPath("/stop")
        } else {
            alert("KeyboardSoundPlayer is not started")
        }
        setStopDisabled(false)
    }

    function check() {
        if (key === "") {
            setError(true)
            return false
        }
        setError(false)
        return true
    }

    async function yt(e) {
        if (!check()) {
            return
        }
        let url = window.prompt("Type a youtube url")
        if (url === null) {
            return
        }
        if (url === "") {
            await yt(e)
            return
        }
        if (!url.startsWith("https://")) {
            url = "https://" + url
        }
        if (!url.includes("youtube.com")) {
            alert("Invalid URL")
            return
        }
        await AddKey(key, url)
        setKey("")
    }

    async function file(e) {
        if (!check()) {
            return
        }
        let file = await FilePrompt()
        if (file === "") {
            return
        }
        await AddKey(key, file)
        setKey("")
    }

    async function text(e) {
        if (!check()) {
            return
        }
        let txt = window.prompt("Type some text or a function name")
        if (txt === null) {
            return
        }
        if (txt === "") {
            await text(e)
        } else {
            await AddKey(key, txt)
            setKey("")
        }
    }

    return (
        <div>
            <Head name="KeyboardSoundPlayer"/>
            <div className="center" id="form">
                <h2>Key Mapping</h2>
                <br/>
                <br/>
                <TextField size="small" required error={error} type="text" value={key} onChange={(e) => {
                    setKey(e.target.value)
                }} placeholder="Type a key" InputProps={{inputProps: {maxLength: 10}}} label="Key" />
                <br/>
                <br/>
                <button className="blue" onClick={yt}>YouTube URL</button>
                <button className="blue" onClick={file}>MP3 File</button>
                <button className="blue" onClick={text}>Text</button>
                <br/>
                <br/>
                <button id="start" disabled={startDisabled} onClick={startCallback}>Start</button>
                <button id="stop" disabled={stopDisabled} onClick={stopCallback}>Stop</button>
            </div>
        </div>
    )
}

export default App
