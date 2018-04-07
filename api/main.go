package main

import (
  "fmt"
  "net/http"
  "log"
  "encoding/json"
)

func main()  {
  fmt.Println("Starting web server on port 8080")
  http.HandleFunc("/", handleRoot)
  http.HandleFunc("/posts", handlePosts)
  http.HandleFunc("/users", handleUsers)
  log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
  fmt.Println("User requested root or unspecifed folder, sending 404")

}

func handleUsers(w http.ResponseWriter, r *http.Request) {
  switch r.Method {
  case "GET":

  case "POST":
    decoder := json.NewDecoder(r.Body)
    var t user
    err := decoder.Decode(&t)
    if err != nil {
      panic(err)
    }
    defer r.Body.Close()
    fmt.Println(t.Username)
  }

}

func handleUsers(w http.ResponseWriter, r *http.Request) {
  switch r.Method {
  case "GET":

  case "POST":
    decoder := json.NewDecoder(r.Body)
    var t user
    err := decoder.Decode(&t)
    if err != nil {
      panic(err)
    }
    defer r.Body.Close()
    fmt.Println(t.Username)
  }

}

func handleMessages(w http.ResponseWriter, r *http.Request) {
  fmt.Println("")
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
  fmt.Println("User requested login")

}

func handlePost(w http.ResponseWriter, r *http.Request) {
  fmt.Println("User requested post")

}
