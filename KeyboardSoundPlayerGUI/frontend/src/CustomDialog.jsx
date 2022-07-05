import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

export function InputDialog({
                         setDialog,
                         dialogState,
                         onClick,
                         button1,
                         button2
                     }) {
    return (
        <Dialog
            open={dialogState.open}
            onClose={(_, reason) => {
                if (reason === "backdropClick") {
                    return
                }
                setDialog({
                    open: false,
                    dialog: "",
                    keyText: "",
                    err: false,
                    helper: ""
                })
            }}
        >
            <DialogTitle fontSize="small">
                {dialogState.dialog}
            </DialogTitle>
            <DialogContent>
                <TextField variant="standard" error={dialogState.err} helperText={dialogState.helper}
                           value={dialogState.keyText}
                           size="small" required
                           type="standard" onChange={(e) => {
                    setDialog({...dialogState, keyText: e.target.value})
                }}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setDialog({
                        open: false,
                        dialog: "",
                        keyText: "",
                        err: false,
                        helper: ""
                    })
                }}>{button1}</Button>
                <Button onClick={onClick}>
                    {button2}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export function MessageDialog({
                           setDialog,
                           dialogState,
                           onClick,
                           button1,
                           button2,
                       }) {
    return (
        <Dialog
            open={dialogState.open}
            onClose={(_, reason) => {
                if (reason === "backdropClick") {
                    return
                }
                setDialog({
                    open: false,
                    dialog: "",
                })
            }}
        >
            <DialogTitle fontSize="small">
                {dialogState.dialog}
            </DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    setDialog({
                        open: false,
                        dialog: "",
                    })
                }}>{button1}</Button>
                <Button onClick={onClick}>
                    {button2}
                </Button>
            </DialogActions>
        </Dialog>
    )
}