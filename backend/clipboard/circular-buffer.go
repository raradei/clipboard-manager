package clipboard

import (
	"encoding/json"
	"os"
)

type Identifiable interface {
	GetId() string
}

type CircularBuffer[T Identifiable] struct {
	data    []T
	size    int
	maxSize int
}

func NewCircularBuffer[T Identifiable](maxSize int) *CircularBuffer[T] {
	return &CircularBuffer[T]{
		data:    make([]T, maxSize),
		size:    0,
		maxSize: maxSize,
	}
}

func (ch *CircularBuffer[T]) LoadClipboardHistory(filePath string) {
	var file *os.File

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		createdFile, _ := os.Create(filePath)
		file = createdFile
	} else {
		existingFile, _ := os.Open(filePath)
		file = existingFile
		decoder := json.NewDecoder(file)
		decoder.Decode(&ch.data)
		ch.size = len(ch.data)
	}

	defer file.Close()
}

func (ch *CircularBuffer[T]) FindItem(Id string) *T {
	for _, item := range ch.data {
		if item.GetId() == Id {
			return &item
		}
	}

	return nil
}

func (cb *CircularBuffer[T]) Add(item T) {
	if cb.size < cb.maxSize {
		cb.size++
	}
	for i := cb.size - 1; i > 0; i-- {
		cb.data[i] = cb.data[i-1]
	}
	cb.data[0] = item
}
