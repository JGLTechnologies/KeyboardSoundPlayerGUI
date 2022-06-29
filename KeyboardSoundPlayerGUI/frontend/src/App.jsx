import Head from "./Head";
import {useRef} from "react";
import {AddKey, FilePrompt, IsOnline, RequestPath, StartFile} from "../wailsjs/go/main/App";
import "./assets/App.css"

function startCallback() {
    async function func() {
        if (!await IsOnline()) {
            await StartFile()
        } else {
            alert("KeyboardSoundPlayer is already started")
        }
    }

    func()
}

function stopCallback() {

    async function func() {
        if (await IsOnline()) {
            await RequestPath("/stop")
        } else {
            alert("KeyboardSoundPlayer is not started")
        }
    }

    func()
}


function App() {
    let key = useRef(null)

    function yt(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
            return
        }
        let url = window.prompt("Type a youtube url")
        if (!url.startsWith("https://")) {
            url = "https://" + url
        }
        if (!url.startsWith("https://youtube.com")) {
            alert("Invalid URL")
            key.current.value = ""
            return
        }
        AddKey(key.current.value, url)
        key.current.value = ""
    }

    function file(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
            return
        }

        async function func() {
            let file = await FilePrompt()
            console.log(file)
            if (file === "") {
                return
            }
            AddKey(key.current.value, file)
            key.current.value = ""
        }

        func()
    }

    function text(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
            return
        }
        let txt = window.prompt("Type the text you want KeyboardSoundPlayer to say")
        if (txt === "") {
            text(e)
            return
        }
        AddKey(key.current.value, txt)
        key.current.value = ""
    }

    return (
        <div>
            <Head name="KeyboardSoundPlayer"/>
            <div className="center" id="form">
                <h2>Key Mapping</h2>
                <br/>
                <br/>
                <input type="text" ref={key} placeholder="Type a key"/>
                <br/>
                <br/>
                <button className="blue" onClick={yt}>YouTube URL</button>
                <button className="blue" onClick={file}>MP3 File</button>
                <button className="blue" onClick={text}>Text</button>
                <br/>
                <br/>
                <button id="start" onClick={startCallback}>Start</button>
                <button id="stop" onClick={stopCallback}>Stop</button>
            </div>
        </div>
    )
}

export default App
