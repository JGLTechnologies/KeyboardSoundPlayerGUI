package main

import (
	"context"
	"embed"
	"fmt"
	"github.com/JGLTechnologies/SimpleFiles"
	"github.com/alexflint/go-filemutex"
	"github.com/imroc/req/v3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

//go:embed frontend/dist
var assets embed.FS
var client = req.C().SetTimeout(time.Second / 2)

const version = "2.0.0"

var checked = false

type App struct {
	ctx context.Context
}

func (a *App) FilePrompt() string {
	file, _ := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{Filters: []runtime.FileFilter{runtime.FileFilter{
		Pattern: "*.mp3",
	}}})
	return file
}

func (a *App) Update() bool {
	res, err := req.C().SetTimeout(time.Second * 5).R().SetOutputFile("installer.exe").Get("https://github.com/JGLTechnologies/KeyboardSoundPlayer/blob/master/KeyboardSoundPlayer%20Setup.exe?raw=true")
	if err != nil || res.IsError() {
		fmt.Println(err.Error())
		return false
	} else {
		err = exec.Command("./installer.exe").Run()
		if err != nil {
			fmt.Println(err.Error())
			return false
		}
	}
	os.Remove("installer.exe")
	runtime.Quit(a.ctx)
	return true
}

func (a *App) NeedsUpdate() bool {
	if checked {
		return false
	}
	defer func() {
		checked = true
	}()
	versionNum, _ := strconv.Atoi(strings.Replace(version, ".", "", -1))
	res, err := req.C().SetTimeout(time.Second * 5).R().Get("https://raw.githubusercontent.com/JGLTechnologies/KeyboardSoundPlayerGUI/master/KeyboardSoundPlayerGUI/version")
	if err != nil || res.IsError() {
		return false
	} else {
		currentVersion, _ := strconv.Atoi(strings.Replace(res.String(), ".", "", -1))
		if currentVersion > versionNum {
			return true
		}
		return false
	}
}

func (a *App) GetKeys() map[string]string {
	file, err := SimpleFiles.New("keys.json")
	if err != nil {
		return map[string]string{}
	}
	var keys map[string]string
	err = file.ReadJSON(&keys)
	if err != nil {
		return map[string]string{}
	}
	return keys
}

func (a *App) SetKeys(keys map[string]string) {
	file, err := SimpleFiles.New("keys.json")
	if err != nil {
		return
	}
	file.WriteJSON(&keys)
}

func (a *App) AddKey(key string, value string) {
	key = strings.ToLower(key)
	file, err := SimpleFiles.New("keys.json")
	if err != nil {
		return
	}
	var keys map[string]string
	err = file.ReadJSON(&keys)
	if err != nil {
		keys = map[string]string{}
	}
	keys[key] = value
	file.WriteJSON(&keys)
}

func (a *App) RemoveMP3(file string) {
	os.Remove(fmt.Sprintf("%v.mp3", file))
}

func (a *App) GetPort() string {
	file, err := SimpleFiles.New("config.json")
	if err != nil {
		return "6238"
	}
	var config map[string]interface{}
	err = file.ReadJSON(&config)
	if err != nil {
		return "6238"
	}
	port, ok := config["port"]
	if ok {
		return fmt.Sprintf("%v", port)
	}
	return "6238"
}

func (a *App) StartFile() {
	exec.Command("./main.exe").Run()
}

func (a *App) IsOnline() bool {
	_, err := client.R().Get("http://localhost:" + a.GetPort())
	return err == nil
}

func (a *App) RequestPath(endpoint string) {
	client.R().Get("http://localhost:" + a.GetPort() + endpoint)
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) dom(ctx context.Context) {
	runtime.EventsEmit(ctx, "update")
}

type Config struct {
	Channels int    `json:"channels"`
	Gender   string `json:"gender"`
	Rate     int    `json:"rate"`
	ExitKey  string `json:"exit_key"`
	Port     int    `json:"port"`
}

func (c *Config) SetConfig(config Config) {
	file, _ := SimpleFiles.New("config.json")
	if config.Channels > 100 {
		config.Channels = 100
	}
	file.WriteJSON(&config)
}

func (c *Config) GetConfig() Config {
	var config Config
	file, _ := SimpleFiles.New("config.json")
	file.ReadJSON(&config)
	return config
}

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
