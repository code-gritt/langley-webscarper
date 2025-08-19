package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
	"webscraper-backend/models"

	"github.com/PuerkitoBio/goquery"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
var jwtKey = []byte("g8Vx1xX7oBLad0fBAA4yowjE1_rBp3HB2paKvVy4sa4=")

// ---------------------- Database Setup ----------------------
func initDB() {
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}
	DB = db
	DB.AutoMigrate(&models.User{}, &models.Job{})
}

// ---------------------- Auth Middleware ----------------------
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		c.Set("email", claims["email"])
		c.Next()
	}
}

// ---------------------- Auth Handlers ----------------------
func register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	if err := DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered"})
}

func login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.User
	if err := DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, _ := token.SignedString(jwtKey)
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// ---------------------- Job Handlers ----------------------
func createJob(c *gin.Context) {
	var input struct {
		URL      string `json:"url" binding:"required"`
		Selector string `json:"selector" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	email, _ := c.Get("email")
	var user models.User
	if err := DB.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	job := models.Job{
		UserID:   user.ID,
		URL:      input.URL,
		Selector: input.Selector,
		Status:   "pending",
	}

	if err := DB.Create(&job).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Job created", "jobId": job.ID})
}

func getJobs(c *gin.Context) {
	email, _ := c.Get("email")
	var user models.User
	if err := DB.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var jobs []models.Job
	if err := DB.Where("user_id = ?", user.ID).Find(&jobs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func executeJob(c *gin.Context) {
	jobID := c.Param("id")
	var job models.Job
	if err := DB.First(&job, jobID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	resp, err := http.Get(job.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch URL"})
		return
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse HTML"})
		return
	}

	var results []string
	doc.Find(job.Selector).Each(func(i int, s *goquery.Selection) {
		results = append(results, s.Text())
	})

	job.Result = fmt.Sprintf("%v", results)
	job.Status = "completed"
	DB.Save(&job)

	c.JSON(http.StatusOK, gin.H{"message": "Job executed", "results": results})
}

// ---------------------- Main ----------------------
func main() {
	initDB()
	r := gin.Default()

	// CORS setup
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "https://langley-webscarper.vercel.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Public
	r.POST("/api/register", register)
	r.POST("/api/login", login)

	// Protected
	api := r.Group("/api")
	api.Use(authMiddleware())
	{
		api.POST("/jobs", createJob)
		api.GET("/jobs", getJobs) // ✅ fetch jobs
		api.POST("/jobs/:id/execute", executeJob)
		api.GET("/jobs/:id/execute", executeJob)
	}

	// Run
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
