package settings

import (
	"context"
	"log"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/hotkey"
	"golang.design/x/hotkey/mainthread"
)

// TODO: get hotkey from settings
type position struct {
	x int
	y int
}

var (
	toggleHotkey   *hotkey.Hotkey  = hotkey.New([]hotkey.Modifier{hotkey.ModCtrl, hotkey.Mod4}, hotkey.KeyV)
	ctx            context.Context = nil
	isHidden       bool            = false
	windowPosition position
)

func InitSettings(context context.Context) {
	ctx = context
	go mainthread.Init(registerToggleHotkey)
}

func registerToggleHotkey() {
	toggleHotkey.Unregister()

	err := toggleHotkey.Register()
	if err != nil {
		log.Fatalf("hotkey: failed to register hotkey: %v", err)
		return
	}

	for range toggleHotkey.Keyup() {
		toggleWndow()
	}
}

func toggleWndow() {
	if isHidden {
		runtime.WindowShow(ctx)
		runtime.WindowSetPosition(ctx, windowPosition.x, windowPosition.y)
	} else {
		windowPosition.x, windowPosition.y = runtime.WindowGetPosition(ctx)
		runtime.WindowHide(ctx)
	}

	isHidden = !isHidden
}
