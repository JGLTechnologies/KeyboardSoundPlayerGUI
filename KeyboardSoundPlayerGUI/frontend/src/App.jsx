import Head from "./Head";
import {useRef, useState} from "react";
import {AddKey, FilePrompt, IsOnline, RequestPath, StartFile} from "../wailsjs/go/main/App";
import "./assets/App.css"

function App() {
    let key = useRef(null)
    let [startDisabled, setStartDisabled] = useState(false)
    let [stopDisabled, setStopDisabled] = useState(false)

    async function startCallback() {
        setStartDisabled(true)
        if (!await IsOnline()) {
            await StartFile()
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

    async function yt(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
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
        await AddKey(key.current.value, url)
        key.current.value = ""
    }

    async function file(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
            return
        }

        let file = await FilePrompt()
        if (file === "") {
            return
        }
        await AddKey(key.current.value, file)
        key.current.value = ""
    }

    async function text(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
            return
        }
        let txt = window.prompt("Type some text or a function name")
        if (txt === null) {
            return
        }
        if (txt === "") {
            await text(e)
        } else {
            await AddKey(key.current.value, txt)
            key.current.value = ""
        }
    }

    return (
        <div>
            <Head name="KeyboardSoundPlayer"/>
            <div className="center" id="form">
                <h2>Key Mapping</h2>
                <br/>
                <br/>
                <input type="text" ref={key} placeholder="Type a key" maxLength="10"/>
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
