import Head from "./Head";
import {useRef} from "react";
import {AddKey, FilePrompt} from "../wailsjs/go/main/App";

function App() {
    let key = useRef(null)

    function yt(e) {
        if (key.current.value === "") {
            alert("Please enter a key")
            return
        }
        let url = window.prompt("Type a youtube url")
        if (!url.startsWith("https://")) {
            alert("URL must start with https://")
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
            let [file, error] = await FilePrompt()
            console.log(file)
            if (file === "") {
                return
            }
            if (error) {
                alert("Something went wrong")
                key.current.value = ""
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
        let txt = window.prompt("Type a youtube url")
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
                <button onClick={yt}>YouTube URL</button>
                <button onClick={file}>MP3 File</button>
                <button onClick={text}>Text</button>
            </div>
        </div>
    )
}

export default App
