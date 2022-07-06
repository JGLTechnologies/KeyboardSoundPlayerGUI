package main

import (
	"context"
	"fmt"
	"github.com/JGLTechnologies/SimpleFiles"
	"github.com/imroc/req/v3"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

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
		return false
	} else {
		err = exec.Command("./installer.exe").Start()
		if err != nil {
			return false
		}
	}
	a.RequestPath("/stop")
	runtime.Quit(a.ctx)
	return true
}

func (a *App) NeedsUpdate() bool {
	if checked {
		return false
	}
	checked = true
	versionNum, _ := strconv.Atoi(strings.Replace(version, ".", "", -1))
	res, err := req.C().SetTimeout(time.Second * 5).R().Get("https://raw.githubusercontent.com/JGLTechnologies/KeyboardSoundPlayer/master/version")
	if err != nil || res.IsError() {
		return false
	} else {
		s, err := res.ToString()
		s = strings.Split(s, "\n")[0]
		if err != nil {
			return false
		}
		currentVersion, _ := strconv.Atoi(strings.Replace(s, ".", "", -1))
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

func (a *App) StartFile() bool {
	cmd := exec.Command("./main.exe")
	err := cmd.Start()
	if err != nil {
		return false
	}
	return true
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
