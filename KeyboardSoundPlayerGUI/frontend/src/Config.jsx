import Head from "./Head";
import {useEffect, useState} from "react";
import {GetConfig, SetConfig} from "../wailsjs/go/main/Config";
import {Alert, FormControl, MenuItem, Snackbar, Stack, TextField} from "@mui/material"
import {IsOnline, RequestPath, StartFile} from "../wailsjs/go/main/App";

async function restart() {
    if (await IsOnline()) {
        await RequestPath("/stop")
        await StartFile()
    }
}

function Config() {
    let [gender, setGender] = useState("")
    let [rate, setRate] = useState("")
    let [port, setPort] = useState("")
    let [channels, setChannels] = useState("")
    let [exit, setExit] = useState("")
    let [update, setUpdate] = useState(true)

    let [channelError, setChannelError] = useState(false)
    let [rateError, setRateError] = useState(false)
    let [exitError, setExitError] = useState(false)
    let [portError, setPortError] = useState(false)

    let [open, setOpen] = useState(false)
    let [msg, setMSG] = useState("")
    let [level, setLevel] = useState("error")

    let [config, changeConfig] = useState({})

    function setSnackBar(level, msg) {
        setMSG(msg)
        setLevel(level)
        setOpen(true)
    }

    useEffect(() => {
        async function func() {
            let currentConfig = await GetConfig()
            setGender(currentConfig.gender)
            setChannels(currentConfig.channels)
            setRate(currentConfig.rate)
            setExit(currentConfig.exit_key)
            setPort(currentConfig.port)
            setUpdate(currentConfig.update)
            changeConfig(currentConfig)
        }

        func()
    }, [])

    function check() {
        if (!document.getElementById("channels").valueOf().checkValidity()) {
            setChannelError(true)
            return false
        } else {
            setChannelError(false)
        }
        if (!document.getElementById("rate").valueOf().checkValidity()) {
            setRateError(true)
            return false
        } else {
            setRateError(false)
        }
        if (!document.getElementById("exit_key").valueOf().checkValidity()) {
            setExitError(true)
            return false
        } else {
            setExitError(false)
        }
        if (!document.getElementById("port").valueOf().checkValidity()) {
            setPortError(true)
            return false
        } else {
            setPortError(false)
        }
        return true
    }

    async function saveConfig(e) {
        if (!check()) {
            return
        }
        e.preventDefault()
        SetConfig({
            channels: Math.trunc(parseInt(channels)),
            gender: gender,
            rate: Math.trunc(parseInt(rate)),
            exit_key: exit,
            port: Math.trunc(parseInt(port)),
            update: Boolean(update)
        })
        changeConfig({
            channels: Math.trunc(parseInt(channels)),
            gender: gender,
            rate: Math.trunc(parseInt(rate)),
            exit_key: exit,
            port: Math.trunc(parseInt(port)),
            update: Boolean(update)
        })
        setSnackBar("success", "Your config has been saved")
        await restart()
    }

    async function undoConfig(e) {
        e.preventDefault()
        let currentConfig = {
            channels: Math.trunc(parseInt(channels)),
            gender: gender,
            rate: Math.trunc(parseInt(rate)),
            exit_key: exit,
            port: Math.trunc(parseInt(port)),
            update: update
        }
        if (JSON.stringify(config) === JSON.stringify(currentConfig)) {
            setSnackBar("info", "There are no changes to undo")
            return
        }
        setChannels(config.channels)
        setGender(config.gender)
        setRate(config.rate)
        setExit(config.exit_key)
        setPort(config.port)
        setUpdate(config.update)

        setPortError(false)
        setRateError(false)
        setExitError(false)
        setChannelError(false)
        setSnackBar("success", "Your changes have been undone")
    }

    async function resetConfig(e) {
        e.preventDefault()
        setChannels(8)
        setGender("male")
        setRate(170)
        setExit("esc")
        setPort(6238)
        setUpdate(true)
        SetConfig({
            channels: 8,
            gender: "male",
            rate: 170,
            exit_key: "esc",
            port: 6238,
            update: true
        })
        changeConfig({
            channels: 8,
            gender: "male",
            rate: 170,
            exit_key: "esc",
            port: 6238,
            update: true
        })
        setPortError(false)
        setRateError(false)
        setExitError(false)
        setChannelError(false)
        setSnackBar("success", "Your config has been reset to default")
        await restart()
    }

    function handleClose(_, reason) {
        if (reason === "clickaway" || reason === "escapeKeyDown") {
            return
        }
        setOpen(false)
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} variant="standard" severity={level} sx={{width: '100%'}}>
                    {msg}
                </Alert>
            </Snackbar>
            <Head name="Config"/>
            <div id="config">
                <h2>Config</h2>
                <br/>
                <FormControl>
                    <Stack direction="column" spacing={3}>
                        <TextField onChange={(e) => {
                            setChannels(e.target.value)
                            if (document.getElementById("channels").valueOf().checkValidity()) {
                                setChannelError(false)
                            }
                        }} value={channels} id="channels" error={channelError} required size="small" label="Channels"
                                   type="number"
                                   InputProps={{inputProps: {max: 100, min: 0}}}/>
                        <TextField onChange={(e) => {
                            setRate(e.target.value)
                            if (document.getElementById("rate").valueOf().checkValidity()) {
                                setRateError(false)
                            }
                        }} value={rate} id="rate" error={rateError} required size="small"
                                   InputProps={{inputProps: {min: 1, max: 100000}}}
                                   type="number" label="Rate"/>
                        <TextField onChange={(e) => {
                            setExit(e.target.value)
                            if (document.getElementById("exit_key").valueOf().checkValidity()) {
                                setExitError(false)
                            }
                        }} value={exit} id="exit_key" error={exitError} required size="small" type="text"
                                   label="Exit Key"/>
                        <TextField onChange={(e) => {
                            setPort(e.target.value)
                            if (document.getElementById("port").valueOf().checkValidity()) {
                                setPortError(false)
                            }
                        }} value={port} id="port" error={portError} required size="small"
                                   InputProps={{inputProps: {min: 1, max: 60000}}}
                                   label="Port"
                                   type="number"/>
                        <TextField required size="small" label="Gender" value={gender} select
                                   onChange={(e) => {
                                       setGender(e.target.value)
                                   }}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </TextField>
                        <TextField required size="small" label="Ask For Updates" value={update} select
                                   onChange={(e) => {
                                       setUpdate(e.target.value)
                                   }}>
                            <MenuItem value="true">True</MenuItem>
                            <MenuItem value="false">False</MenuItem>
                        </TextField>
                        <br/>
                        <br/>
                    </Stack>
                    <Stack direction="row">
                        <button className="blue" onClick={saveConfig}>Save</button>
                        <button className="blue" onClick={resetConfig}>Reset</button>
                        <button className="blue" onClick={undoConfig}>Undo</button>
                    </Stack>
                </FormControl>
            </div>
        </div>
    )
}

export default Config
