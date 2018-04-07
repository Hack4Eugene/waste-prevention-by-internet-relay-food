package main

import (

)

type user struct {
  ID string
  Username string
  Email string
  
}

type post struct {
  ID string
  UserID string
  CreatingDate string
  Title string
  Status string
  Eligibility string
  Amount string
  Readiness string
  Description string
  PickupWindow string
  PickupAddress string
}

type searches struct {
  UserID string
  SearchTerm string
}

type pictures struct {
  PostID string
  PictureURL string
}
