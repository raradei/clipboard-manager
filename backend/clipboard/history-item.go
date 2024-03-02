package clipboard

type HistoryItem struct {
	Id    string `json:"id"`
	Value string `json:"value"`
}

func (item HistoryItem) GetId() string {
	return item.Id
}
