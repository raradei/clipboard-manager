package main

import (
	"context"
	"fmt"
	clipboard "main/backend/clipboard"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	fmt.Println("starting app")

	a.ctx = ctx
	clipboard.InitListener(ctx)
	clipboard.InitWatcher(ctx)
}

func (a *App) GetClipboardHistory() []clipboard.StringData {
	return clipboard.GetClipboardHistory()
}
