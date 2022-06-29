import {useCallback, useEffect, useState} from "react";
import {GetKeys, RemoveMP3, SetKeys} from "../wailsjs/go/main/App";
import "./assets/App.css";
import Head from "./Head";

function Keys() {
    let [keys, changeKeys] = useState(null)
    let [_, update] = useState(0)

    let forceUpdate = useCallback(() => {
        update(value => value + 1)
    }, [])

    useEffect(() => {
        async function fetchKeys() {
            let newKeys = await GetKeys()
            if (newKeys !== undefined && newKeys !== null) {
                changeKeys(newKeys)
            } else {
                changeKeys({})
            }
        }

        fetchKeys()
    }, [])

    let list
    if (keys === undefined || keys === null) {
        list = []
    } else {
        list = Object.keys(keys)
    }

    if (list.length > 0) {
        return (
            <div>
                <Head name="Key Mapping"/>
                <ul className="keys">
                    {
                        list.map(key => (
                            <li key={key} className="upper-left">{key.toUpperCase()} -&gt; {keys[key]}
                                <button className="delete" onClick={() => {
                                    let currentKeys = keys.valueOf()
                                    delete currentKeys[key]
                                    changeKeys(currentKeys)
                                    SetKeys(keys)
                                    RemoveMP3(key)
                                    forceUpdate()
                                }}>X
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    } else {
        return (
            <div>
                <Head name="Key Maps"/>
                <p className="upper-left">No keys have been configured.</p>
            </div>
        )
    }

}

export default Keys
