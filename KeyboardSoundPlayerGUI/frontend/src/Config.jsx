import Head from "./Head";
import {useEffect, useRef, useState} from "react";
import {GetConfig, SetConfig} from "../wailsjs/go/main/Config";

function Config() {
    let [channels, gender, rate, exit, port] = [useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null)]
    let [config, changeConfig] = useState({})

    useEffect(() => {
        async function func() {
            let currentConfig = await GetConfig()
            channels.current.value = currentConfig.channels !== 0 ? currentConfig.channels : 8
            gender.current.value = currentConfig.gender !== "" ? currentConfig.gender : "male"
            rate.current.value = currentConfig.rate !== 0 ? currentConfig.rate : 170
            exit.current.value = currentConfig.exit_key !== "" ? currentConfig.exit_key : "esc"
            port.current.value = currentConfig.port !== 0 ? currentConfig.port : 6238

            await SetConfig({
                channels: parseInt(channels.current.value),
                gender: gender.current.value,
                rate: parseInt(rate.current.value),
                exit_key: exit.current.value,
                port: parseInt(port.current.value)
            })
            changeConfig(currentConfig)
        }
        func()
    }, [])

    function saveConfig(e) {
        e.preventDefault()
        if (!["male", "female"].includes(gender.current.value.toLowerCase())) {
            alert("Invalid gender")
            gender.current.value = "male"
            return
        }
        SetConfig({
            channels: Math.trunc(parseInt(channels.current.value)),
            gender: gender.current.value,
            rate: Math.trunc(parseInt(rate.current.value)),
            exit_key: exit.current.value,
            port: Math.trunc(parseInt(port.current.value))
        })
        changeConfig({
            channels: Math.trunc(parseInt(channels.current.value)),
            gender: gender.current.value,
            rate: Math.trunc(parseInt(rate.current.value)),
            exit_key: exit.current.value,
            port: Math.trunc(parseInt(port.current.value))
        })
    }

    function undoConfig(e) {
        e.preventDefault()
        let currentConfig = config
        channels.current.value = currentConfig.channels !== 0 ? currentConfig.channels : 8
        gender.current.value = currentConfig.gender !== "" ? currentConfig.gender : "male"
        rate.current.value = currentConfig.rate !== 0 ? currentConfig.rate : 170
        exit.current.value = currentConfig.exit_key !== "" ? currentConfig.exit_key : "esc"
        port.current.value = currentConfig.port !== 0 ? currentConfig.port : 6238
    }

    return (
        <div>
            <Head name="Config"/>
            <div className="center" id="form">
                <h2>Config</h2>
                <br/>
                <br/>
                <form>
                    <input defaultValue={8} type="number" ref={channels} placeholder="Channels"/>
                    <br/>
                    <input defaultValue="male" type="text" ref={gender} placeholder="Gender" list="genders"/>
                    <datalist id="genders">
                        <option value="male"/>
                        <option value="female"/>
                    </datalist>
                    <br/>
                    <input defaultValue={170} type="number" ref={rate} placeholder="Rate"/>
                    <br/>
                    <input defaultValue="esc" type="text" ref={exit} placeholder="Exit Key"/>
                    <br/>
                    <input defaultValue="port" type="number" ref={port} placeholder="Port"/>
                    <br/>
                    <br/>
                    <button className="blue" onClick={saveConfig}>Save</button>
                    <button className="blue" onClick={undoConfig}>undo</button>
                </form>
            </div>
        </div>
    )
}

export default Config
