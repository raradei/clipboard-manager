package clipboard

import (
	"encoding/json"
	"os"
)

type StringData struct {
	Id    string `json:"id"`
	Value string `json:"value"`
}

type ClipboardHistory struct {
	Data []StringData
}

func (clipboardHistory *ClipboardHistory) loadClipboardHistory(filePath string) {
	var file *os.File

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		createdFile, _ := os.Create(filePath)
		file = createdFile
	} else {
		existingFile, _ := os.Open(filePath)
		file = existingFile
		decoder := json.NewDecoder(file)
		decoder.Decode(&clipboardHistory.Data)
	}

	defer file.Close()
}

func (clipboardHistory *ClipboardHistory) findItem(Id string) *StringData {
	for _, item := range clipboardHistory.Data {
		if item.Id == Id {
			return &item
		}
	}

	return nil
}
