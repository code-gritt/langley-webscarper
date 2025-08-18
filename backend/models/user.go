package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID        uint   `gorm:"primaryKey"`
	Email     string `gorm:"unique;not null"`
	Password  string `gorm:"not null"`
	Credits   int    `gorm:"default:100"` // Free tier starting credits
	CreatedAt int64  `gorm:"autoCreateTime"`
}
