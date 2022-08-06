import Head from "./Head"
import {useEffect, useState} from "react"
import {GetConfig, SetConfig} from "../wailsjs/go/main/Config"
import {Alert, AlertColor, FormControl, MenuItem, Snackbar, Stack, TextField} from "@mui/material"
import {IsOnline, RequestPath, StartFile} from "../wailsjs/go/main/App"
import {main} from "../wailsjs/go/models"

const defaultConfig = {
    channels: 8,
    gender: "male",
    rate: 170,
    exit_key: "esc",
    port: 6238,
    update: true
}

function toBool(str: string): boolean {
    return str.toLowerCase() === "true";

}

async function restart() {
    if (await IsOnline()) {
        await RequestPath("/stop")
        await StartFile()
    }
}

interface errors {
    channel: boolean
    rate: boolean
    exit: boolean
    port: boolean
}

function Config() {
    let [errors, setErrors] = useState({
        channel: false,
        rate: false,
        exit: false,
        port: false,
    } as errors)

    let [open, setOpen] = useState(false)
    let [msg, setMSG] = useState("")
    let [level, setLevel] = useState<AlertColor>("error")

    let [config, changeConfig] = useState<main.Config>(defaultConfig)

    let [lastConfig, setLastConfig] = useState<main.Config>(defaultConfig)

    function setSnackBar(level, msg) {
        setMSG(msg)
        setLevel(level)
        setOpen(true)
    }

    useEffect(() => {
        async function func() {
            let currentConfig = await GetConfig()
            changeConfig(currentConfig)
            setLastConfig(currentConfig)
        }

        func()
    }, [])

    function check() {
        if (!(document.getElementById("channels") as HTMLInputElement).checkValidity()) {
            setErrors({...errors, channel: true})
            return false
        } else {
            setErrors({...errors, channel: false})
        }
        if (!(document.getElementById("rate") as HTMLInputElement).checkValidity()) {
            setErrors({...errors, rate: true})
            return false
        } else {
            setErrors({...errors, rate: false})
        }
        if (!(document.getElementById("exit_key") as HTMLInputElement).checkValidity()) {
            setErrors({...errors, exit: true})
            return false
        } else {
            setErrors({...errors, exit: false})
        }
        if (!(document.getElementById("port") as HTMLInputElement).checkValidity()) {
            setErrors({...errors, port: true})
            return false
        } else {
            setErrors({...errors, port: false})
        }
        return true
    }

    async function saveConfig() {
        if (!check()) {
            return
        }
        SetConfig(config)
        setLastConfig(config)
        setSnackBar("success", "Your config has been saved")
        await restart()
    }

    async function undoConfig() {
        if (JSON.stringify(lastConfig) === JSON.stringify(config)) {
            setSnackBar("info", "There are no changes to undo")
            return
        }
        changeConfig(lastConfig)
        setErrors({
            channel: false, exit: false, port: false, rate: false
        })
        setSnackBar("success", "Your changes have been undone")
    }

    async function resetConfig() {
        SetConfig(defaultConfig)
        changeConfig(defaultConfig)
        setLastConfig(defaultConfig)
        setErrors({
            channel: false, exit: false, port: false, rate: false
        })
        setSnackBar("success", "Your config has been reset to default")
        await restart()
    }

    function handleClose() {
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
                            changeConfig({...config, channels: parseInt(e.target.value)})
                            if ((document.getElementById("channels") as HTMLInputElement).checkValidity()) {
                                setErrors({...errors, channel: false})
                            }
                        }} value={config.channels} id="channels" error={errors.channel} required size="small"
                                   label="Channels"
                                   type="number"
                                   InputProps={{inputProps: {max: 100, min: 0}}}/>
                        <TextField onChange={(e) => {
                            changeConfig({...config, rate: parseInt(e.target.value)})
                            if ((document.getElementById("rate") as HTMLInputElement).checkValidity()) {
                                setErrors({...errors, rate: false})
                            }
                        }} value={config.rate} id="rate" error={errors.rate} required size="small"
                                   InputProps={{inputProps: {min: 1, max: 100000}}}
                                   type="number" label="Rate"/>
                        <TextField onChange={(e) => {
                            changeConfig({...config, exit_key: e.target.value})
                            if ((document.getElementById("exit_key") as HTMLInputElement).checkValidity()) {
                                setErrors({...errors, exit: false})
                            }
                        }} value={config.exit_key} id="exit_key" error={errors.exit} required size="small" type="text"
                                   label="Exit Key"/>
                        <TextField onChange={(e) => {
                            changeConfig({...config, port: parseInt(e.target.value)})
                            if ((document.getElementById("port") as HTMLInputElement).checkValidity()) {
                                setErrors({...errors, port: false})
                            }
                        }} value={config.port} id="port" error={errors.port} required size="small"
                                   InputProps={{inputProps: {min: 1, max: 60000}}}
                                   label="Port"
                                   type="number"/>
                        <TextField required size="small" label="Gender" value={config.gender} select
                                   onChange={(e) => {
                                       changeConfig({...config, gender: e.target.value})
                                   }}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </TextField>
                        <TextField required size="small" label="Ask For Updates" value={config.update.toString()} select
                                   onChange={(e) => {
                                       changeConfig({...config, update: toBool(e.target.value)})
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
