package main

import (
	"context"
	"embed"
	"fmt"
	"github.com/JGLTechnologies/SimpleFiles"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"log"
	"os"
	"strings"
)

//go:embed frontend/dist
var assets embed.FS

type App struct {
	ctx context.Context
}

func (a *App) FilePrompt() string {
	file, _ := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{Filters: []runtime.FileFilter{runtime.FileFilter{
		Pattern: "*.mp3",
	}}})
	return file
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

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
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
	app := &App{}

	err := wails.Run(&options.App{
		Title:         "KeyboardSoundPlayer",
		Width:         900,
		Height:        700,
		Assets:        assets,
		DisableResize: true,
		OnStartup:     app.startup,
		Bind: []interface{}{
			app,
			&Config{},
		},
	})

	if err != nil {
		log.Fatalln(err.Error())
	}
}
