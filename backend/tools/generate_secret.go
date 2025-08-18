package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

func main() {
	// Generate 32 random bytes (256-bit key)
	key := make([]byte, 32)
	_, err := rand.Read(key)
	if err != nil {
		panic(err)
	}

	// Print base64-encoded secret
	fmt.Println(base64.URLEncoding.EncodeToString(key))
}
