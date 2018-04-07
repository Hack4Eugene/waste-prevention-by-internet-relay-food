package main

import (
  "fmt"
  // "net/http"
  // "log"
  // "encoding/json"

// Go get the following packages
  "gopkg.in/mgo.v2"

)



// Searches the description and title of all offers which are still pending
// and contain the search string as a substring of the title or description.
func GetAllOffersByText(searchString string, s *mgo.Session){
  session := s.Copy()
  defer session.Close()
  // assumes database name "irf"
  posts := session.DB("irf").C("Posts")

  // will this return multiple times if a title matches more than once, etc?
  results = posts.find({$or : [{"Title" : {$regex : ".*" + searchString + ".*"}},{"Description" : {$regex : ".*" + searchString + ".*"}}]})

  // Go complains if you don't use a variable, use _ if you aren't ever going to use it
  fmt.Println(results)
}
