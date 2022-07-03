import {useCallback, useEffect, useState} from "react";
import {GetKeys, RemoveMP3, SetKeys} from "../wailsjs/go/main/App";
import "./assets/App.css";
import Head from "./Head";
import Arrow from "@mui/icons-material/ArrowForward"
import Delete from "@mui/icons-material/Delete"
import {Button, Box} from "@mui/material";
import styled from 'styled-components'

const StyledButton = styled(Button)`
    &:hover {
        background: none;
    }
`

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
                <Head name="Key Maps"/>
                <Box sx={{width: "800px", position: "relative", top: "15px", left: "15px", paddingRight: "20px", paddingBottom: "20px"}}>
                <ul style={{wordBreak: "break-all"}}>
                    {
                        list.map(key => (
                            <li key={key} style={{marginLeft: "15px"}} >
                                <StyledButton onClick={() => {
                                    let currentKeys = keys.valueOf()
                                    delete currentKeys[key]
                                    changeKeys(currentKeys)
                                    SetKeys(keys)
                                    RemoveMP3(key)
                                    forceUpdate()
                                }}><Delete fontSize="small" color="error"/>
                                </StyledButton>
                                {key.toUpperCase()} <Arrow style={{marginLeft: "10px", marginRight: "10px"}}/> {keys[key]}
                            </li>
                        ))
                    }
                </ul>
                </Box>
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
