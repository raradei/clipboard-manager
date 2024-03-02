package clipboard

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/google/uuid"
	"golang.design/x/clipboard"
)

var (
	filePath     string
	currentTimer *time.Timer
	skipData     bool = false
	// TODO: get and update data based on settings
	ttlSeconds       uint8 = 5
	clipboardHistory       = NewCircularBuffer[HistoryItem](5)
)

func clipboardDataHandler(ctx context.Context, data string) bool {
	stringObj := HistoryItem{Id: uuid.NewString(), Value: data}
	clipboardHistory.Add(stringObj)

	jsonData, err := json.MarshalIndent(clipboardHistory.data, "", "  ")
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

	runtime.EventsEmit(ctx, "clipboardUpdate", clipboardHistory.data)

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
	clipboardHistory.LoadClipboardHistory(filePath)

	ch := clipboard.Watch(ctx, clipboard.FmtText)

	for data := range ch {
		if bytes.Equal(data, []byte{'\n'}) {
			continue
		}

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
		selectedItem := clipboardHistory.FindItem(id)
		clipboard.Write(clipboard.FmtText, []byte(selectedItem.Value))

		currentTimer = startResetTimer()
	})
}

func GetClipboardHistory() []HistoryItem {
	if clipboardHistory.data == nil {
		return []HistoryItem{}
	}

	log.Println(clipboardHistory.data)

	return clipboardHistory.data
}
