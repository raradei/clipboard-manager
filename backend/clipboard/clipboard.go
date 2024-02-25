package clipboard

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/google/uuid"
	"golang.design/x/clipboard"
)

var filePath string
var clipboardHistory ClipboardHistory
var currentTimer *time.Timer
var skipData bool = false
var ttlSeconds uint8 = 5

func clipboardDataHandler(ctx context.Context, data string) bool {
	stringObj := StringData{Id: uuid.NewString(), Value: data}
	clipboardHistory.Data = append([]StringData{stringObj}, clipboardHistory.Data...)

	jsonData, err := json.MarshalIndent(clipboardHistory.Data, "", "  ")
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		return false
	}

	dataFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return false
	}

	_, err = dataFile.Write(jsonData)
	if err != nil {
		fmt.Println("Error writing JSON to file:", err)
	}

	err = dataFile.Close()
	if err != nil {
		fmt.Println("Error closing file:", err)
	}

	runtime.EventsEmit(ctx, "clipboardUpdate", clipboardHistory.Data)

	return true
}

func startResetTimer() *time.Timer {
	return time.AfterFunc(time.Duration(ttlSeconds)*time.Second, func() {
		fmt.Println("Clipboard cleared")

		clipboard.Write(clipboard.FmtText, []byte(""))
	})
}

func stopTimer(timer *time.Timer) {
	fmt.Println("Stop timer ", timer)

	if timer != (*time.Timer)(nil) {
		timer.Stop()
	}
}

func InitWatcher(ctx context.Context) {
	fmt.Println("Starting string clipboard watcher channel")

	err := clipboard.Init()
	if err != nil {
		panic(err)
	}

	tempDir := os.TempDir()
	filePath = filepath.Join(tempDir, "clipboard-history.json")
	clipboardHistory.loadClipboardHistory(filePath)

	ch := clipboard.Watch(ctx, clipboard.FmtText)

	for data := range ch {
		if skipData {
			skipData = false
			continue
		}

		handledSuccessfully := clipboardDataHandler(ctx, string(data))

		if !handledSuccessfully {
			continue
		}

		fmt.Println("Clipboard data saved")

		stopTimer(currentTimer)
		currentTimer = startResetTimer()
	}
}

func InitListener(ctx context.Context) {
	runtime.EventsOn(ctx, "selectItem", func(optionalData ...interface{}) {
		stopTimer(currentTimer)

		skipData = true
		id := optionalData[0].(string)
		selectedItem := clipboardHistory.findItem(id)
		clipboard.Write(clipboard.FmtText, []byte(selectedItem.Value))

		currentTimer = startResetTimer()
	})
}

func GetClipboardHistory() []StringData {
	if clipboardHistory.Data == nil {
		return []StringData{}
	}

	return clipboardHistory.Data
}
