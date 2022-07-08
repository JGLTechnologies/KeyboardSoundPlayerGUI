package main

import (
	"embed"
	"github.com/alexflint/go-filemutex"
	"github.com/imroc/req/v3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"log"
	"time"
)

//go:embed frontend/dist
var assets embed.FS
var client = req.C().SetTimeout(time.Second / 2)

const version = "2.0.9"

var checked = false

func main() {
	m, lockErr := filemutex.New("gui_lock")
	if lockErr != nil {
		log.Fatalln("Lock file could not be created")
	}
	if m.TryLock() != nil {
		return
	}
	defer m.Unlock()

	app := &App{}
	err := wails.Run(&options.App{
		Title:         "KeyboardSoundPlayer",
		Width:         900,
		Height:        700,
		Assets:        assets,
		DisableResize: true,
		OnStartup:     app.startup,
		OnDomReady:    app.dom,
		Bind: []interface{}{
			app,
			&Config{},
		},
	})

	if err != nil {
		log.Fatalln(err.Error())
	}
}
