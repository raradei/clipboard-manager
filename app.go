package main

import (
	"context"
	"log"
	"main/backend/clipboard"
	"main/backend/settings"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	log.Print("Starting app")

	a.ctx = ctx
	settings.InitSettings(ctx)
	clipboard.InitListener(ctx)
	go clipboard.InitWatcher(ctx)
}

func (a *App) GetClipboardHistory() []clipboard.StringData {
	return clipboard.GetClipboardHistory()
}
