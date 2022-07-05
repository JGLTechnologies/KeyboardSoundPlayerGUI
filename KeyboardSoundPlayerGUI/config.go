package main

import (
	"errors"
	"github.com/JGLTechnologies/SimpleFiles"
	"os"
)

type Config struct {
	Channels int    `json:"channels"`
	Gender   string `json:"gender"`
	Rate     int    `json:"rate"`
	ExitKey  string `json:"exit_key"`
	Port     int    `json:"port"`
	Update   bool   `json:"update"`
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
	if _, err := os.Stat("config.json"); errors.Is(err, os.ErrNotExist) {
		file, _ := SimpleFiles.New("config.json")
		file.WriteJSON(&Config{
			Channels: 8,
			Gender:   "male",
			Rate:     170,
			ExitKey:  "esc",
			Port:     6238,
			Update:   true,
		})
	}
	file, _ := SimpleFiles.New("config.json")
	file.ReadJSON(&config)
	return config
}
