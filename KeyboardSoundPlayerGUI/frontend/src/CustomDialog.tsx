import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {GetConfig, SetConfig} from "../wailsjs/go/main/Config";
import {dialogState} from "./App";
import * as React from "react";

interface inputDialogProps {
    setDialog: React.Dispatch<React.SetStateAction<any>>
    dialogState: dialogState
    onClick: React.MouseEventHandler<HTMLButtonElement>
    button1: string
    button2: string
    onChange: (Object) => any
}

interface messageDialogProps {
    setDialog: React.Dispatch<React.SetStateAction<any>>
    dialogState: dialogState
    onClick: React.MouseEventHandler<HTMLButtonElement>
    button1: string
    button2: string
}

export function InputDialog(props: inputDialogProps) {
    return (
        <Dialog
            open={props.dialogState.open}
            onClose={(_, reason) => {
                if (reason === "backdropClick") {
                    return
                }
                props.setDialog({
                    open: false,
                    dialog: "",
                    keyText: "",
                    err: false,
                    helper: ""
                })
            }}
        >
            <DialogTitle fontSize="small">
                {props.dialogState.dialog}
            </DialogTitle>
            <DialogContent>
                <TextField variant="standard" error={props.dialogState.err} helperText={props.dialogState.helper}
                           value={props.dialogState.keyText}
                           size="small" required
                           type="standard" onChange={props.onChange}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setDialog({
                        open: false,
                        dialog: "",
                        keyText: "",
                        err: false,
                        helper: ""
                    })
                }}>{props.button1}</Button>
                <Button onClick={props.onClick}>
                    {props.button2}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export function MessageDialog(props: messageDialogProps) {
    return (
        <Dialog
            open={props.dialogState.open}
            onClose={(_, reason) => {
                if (reason === "backdropClick") {
                    return
                }
                props.setDialog({
                    open: false,
                    dialog: "",
                })
            }}
        >
            <DialogTitle fontSize="small">
                {props.dialogState.dialog}
            </DialogTitle>
            <DialogActions>
                <Button onClick={async () => {
                    props.setDialog({
                        open: false,
                        dialog: "",
                    })
                    let config = await GetConfig()
                    await SetConfig({...config, update: false})
                }}>{props.button1}</Button>
                <Button onClick={props.onClick}>
                    {props.button2}
                </Button>
            </DialogActions>
        </Dialog>
    )
}