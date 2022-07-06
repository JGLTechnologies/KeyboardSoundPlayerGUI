import Head from "./Head";
import {useEffect, useState} from "react";
import {AddKey, FilePrompt, IsOnline, NeedsUpdate, RequestPath, StartFile, Update} from "../wailsjs/go/main/App";
import "./assets/App.css"
import {Alert, Snackbar, TextField} from "@mui/material";
import {InputDialog, MessageDialog} from "./CustomDialog";
import {GetConfig} from "../wailsjs/go/main/Config";

const re = new RegExp("^(http(s)??\\:\\/\\/)?(www\\.)?((youtube\\.com\\/watch\\?v=)|(youtu.be\\/))([a-zA-Z0-9\\-_])+")

function App() {
    let [key, setKey] = useState("")
    let [startDisabled, setStartDisabled] = useState(false)
    let [stopDisabled, setStopDisabled] = useState(false)
    let [error, setError] = useState(false)
    let [open, setOpen] = useState(false)
    let [msg, setMSG] = useState("")
    let [level, setLevel] = useState("error")

    let [ytDialog, setYTDialog] = useState({
        open: false,
        dialog: "",
        keyText: "",
        err: false,
        helper: ""
    })

    let [txtDialog, setTxtDialog] = useState({
        open: false,
        dialog: "",
        keyText: "",
        err: false,
        helper: ""
    })

    let [updateDialog, setUpdateDialog] = useState({
        open: false,
        dialog: "",
    })

    useEffect(() => {
        async function checkUpdate() {
            let config = await GetConfig()
            if (!config.update) {
                return
            }
            let needsUpdate = await NeedsUpdate()
            if (needsUpdate) {
                setUpdateDialog({
                    ...updateDialog,
                    open: true,
                    dialog: "There is an update available, would you like to install it?",
                })
            }
        }

        checkUpdate()
    }, [])

    function setSnackBar(level, msg) {
        setMSG(msg)
        setLevel(level)
        setOpen(true)
    }

    async function startCallback() {
        setStartDisabled(true)
        if (!await IsOnline()) {
            if (!await StartFile()) {
                setSnackBar("error", "Something went wrong while starting KeyboardSoundPlayer")
            }
        } else {
            setSnackBar("error", "KeyboardSoundPlayer is already started")
        }
        setStartDisabled(false)
    }

    async function stopCallback() {
        setStopDisabled(true)
        if (await IsOnline()) {
            await RequestPath("/stop")
        } else {
            setSnackBar("error", "KeyboardSoundPlayer is not started")
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

    async function ytDialogCallback() {
        if (!check()) {
            return
        }
        setYTDialog({...ytDialog, dialog: "Type a YouTube URL", open: true})
    }

    async function textDialogCallback() {
        if (!check()) {
            return
        }
        setTxtDialog({...txtDialog, dialog: "Type some text or a function", open: true})
    }

    async function yt(e) {
        let url = ytDialog.keyText
        if (!url.startsWith("https://")) {
            if (url.startsWith("http://")) {
                url = "https://" + url.slice(7)
                console.log(url)
            } else {
                url = "https://" + url
            }
        }
        if (!re.test(url)) {
            setYTDialog({...ytDialog, err: true, helper: "Invalid YouTube URL"})
            return
        }
        setYTDialog({...ytDialog, err: false, helper: "", open: false, keyText: ""})
        await AddKey(key, url)
        setSnackBar("success", "The key has been successfully configured")
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
        setSnackBar("success", "The key has been successfully configured")
    }

    async function text(e) {
        if (!check()) {
            return
        }
        let txt = txtDialog.keyText
        if (txt === "") {
            setTxtDialog({...txtDialog, err: true, helper: "This field is required"})
            return
        }
        setTxtDialog({...txtDialog, err: false, helper: "", open: false, keyText: ""})
        await AddKey(key, txt)
        setKey("")
        setSnackBar("success", "The key has been successfully configured")
    }

    function handleClose(_, reason) {
        if (reason === "clickaway" || reason === "escapeKeyDown") {
            return;
        }
        setOpen(false);
    }

    async function update() {
        setUpdateDialog({
            open: false,
            dialog: "",
        })
        setSnackBar("info", "Attempting to update KeyboardSoundPlayer...")
        if (!await Update()) {
            setSnackBar("error", "Something went wrong while updating")
        }
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} variant="standard" severity={level} sx={{width: '100%'}}>
                    {msg}
                </Alert>
            </Snackbar>
            <Head name="KeyboardSoundPlayer"/>
            <div className="center" id="form">
                <h2>Key Mapping</h2>
                <br/>
                <br/>
                <TextField size="small" required error={error} type="text" value={key} onChange={(e) => {
                    setKey(e.target.value)
                }} placeholder="Type a key" InputProps={{inputProps: {maxLength: 10}}} label="Key"/>
                <br/>
                <br/>
                <button className="blue" onClick={ytDialogCallback}>YouTube URL
                </button>
                <button className="blue" onClick={file}>MP3 File</button>
                <button className="blue" onClick={textDialogCallback}>Text
                </button>
                <br/>
                <br/>
                <button id="start" disabled={startDisabled} onClick={startCallback}>Start</button>
                <button id="stop" disabled={stopDisabled} onClick={stopCallback}>Stop</button>
            </div>
            <InputDialog onClick={text} dialogState={txtDialog} setDialog={setTxtDialog} button1={"Cancel"}
                         button2={"Ok"}/>
            <InputDialog onClick={yt} dialogState={ytDialog} setDialog={setYTDialog} button1={"Cancel"}
                         button2={"Ok"}/>
            <MessageDialog onClick={update} dialogState={updateDialog} setDialog={setUpdateDialog} button1={"No"}
                           button2={"Yes"}/>
        </div>
    )
}

export default App
