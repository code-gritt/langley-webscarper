package models

type Job struct {
	ID        uint   `gorm:"primaryKey"`
	UserID    uint   `gorm:"not null"` // Link to User
	URL       string `gorm:"not null"`
	Selector  string `gorm:"not null"` // CSS selector for scraping
	Status    string `gorm:"default:'pending'"`
	Result    string // Store scraped data as JSON
	CreatedAt int64  `gorm:"autoCreateTime"`
}
