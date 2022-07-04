import Head from "./Head";
import {useState} from "react";
import {AddKey, FilePrompt, IsOnline, RequestPath, StartFile} from "../wailsjs/go/main/App";
import "./assets/App.css"
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField} from "@mui/material";

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

    function setSnackBar(level, msg) {
        setMSG(msg)
        setLevel(level)
        setOpen(true)
    }

    async function startCallback() {
        setStartDisabled(true)
        if (!await IsOnline()) {
            StartFile()
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
        if (url === "") {
            setYTDialog({...ytDialog, err: true, helper: "Invalid YouTube URL"})
            return
        }
        if (!url.startsWith("https://")) {
            url = "https://" + url
        }
        if (!url.includes("youtube.com")) {
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
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
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
            <KeyTextDialog cancel={() => {
                setYTDialog({
                    open: false,
                    dialog: "",
                    keyText: "",
                    err: false,
                    helper: ""
                })
                setKey("")
            }} onClick={yt} dialog={ytDialog.dialog} dialogOpen={ytDialog.open}
                           setDialogOpen={(open) => {
                               setYTDialog({...ytDialog, open: open})
                           }} dialogErr={ytDialog.err} dialogHelperTxt={ytDialog.helper} keyText={ytDialog.keyText}
                           setKeyText={(text) => {
                               setYTDialog({...ytDialog, keyText: text})
                           }}/>

            <KeyTextDialog cancel={() => {
                setTxtDialog({
                    open: false,
                    dialog: "",
                    keyText: "",
                    err: false,
                    helper: ""
                })
                setKey("")
            }} onClick={text} dialog={txtDialog.dialog} dialogOpen={txtDialog.open}
                           setDialogOpen={(open) => {
                               setTxtDialog({...txtDialog, open: open})
                           }} dialogErr={txtDialog.err} dialogHelperTxt={txtDialog.helper} keyText={txtDialog.keyText}
                           setKeyText={(text) => {
                               setTxtDialog({...txtDialog, keyText: text})
                           }}/>
        </div>
    )
}

function KeyTextDialog({
                           dialogOpen,
                           setDialogOpen,
                           dialogErr,
                           dialogHelperTxt,
                           keyText,
                           setKeyText,
                           dialog,
                           onClick,
                           cancel
                       }) {
    return (
        <Dialog
            open={dialogOpen}
            onClose={(_, reason) => {
                if (reason === "clickaway") {
                    return
                }
                setDialogOpen(false)
            }}
        >
            <DialogTitle fontSize="small">
                {dialog}
            </DialogTitle>
            <DialogContent>
                <TextField variant="standard" error={dialogErr} helperText={dialogHelperTxt} value={keyText}
                           size="small" required
                           type="standard" onChange={(e) => {
                    setKeyText(e.target.value)
                }}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel}>Cancel</Button>
                <Button onClick={onClick}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default App
