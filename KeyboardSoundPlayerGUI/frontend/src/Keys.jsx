import {useEffect, useState} from "react";
import {GetKeys, SetKeys, RemoveMP3} from "../wailsjs/go/main/App";
import "./App.css";

function Keys() {
    let [keys, changeKeys] = useState({})

    useEffect(() => {
        async function fetchKeys() {
            if (keys.length === 0) {
                changeKeys(await GetKeys())
            } else {
                await SetKeys(keys)
            }
        }
        fetchKeys()
    }, [keys])

    useEffect(() => {
    })

    return (
        <ul>
            {
                Object.keys(keys).map(key => (
                    <li>{key.toUpperCase()}: {keys[key]}
                        <button className="delete" onClick={() => {
                            let currentKeys = keys.valueOf()
                            delete currentKeys[key]
                            changeKeys(currentKeys)
                            RemoveMP3(key)
                        }}>X</button>
                    </li>
                ))
            }
        </ul>
    )
}

export default Keys
