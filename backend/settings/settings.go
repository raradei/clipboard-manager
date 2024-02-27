package settings

import (
	"context"
	"log"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/hotkey"
	"golang.design/x/hotkey/mainthread"
)

// TODO: get hotkey from settings
var toggleHotkey = hotkey.New([]hotkey.Modifier{hotkey.ModCtrl, hotkey.Mod4}, hotkey.KeyV)
var ctx context.Context
var isHidden = false

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
	} else {
		runtime.WindowHide(ctx)
	}

	isHidden = !isHidden

	log.Println("toggle window")
}
