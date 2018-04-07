####instructions for use####
1.first link the fnctionality script,
2. async defer link the google.js script
3. async defer the api key:
'<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuUJl43vI8auaFBkq5WDQC5rF-FV71hK4&callback=initMap">
    console.log("we are reading the api now!");
    </script>'

##Key entities right now: ##



| Searching for just one post 

 'function catchJustOne(postID)'
 
| searching for several posts

'function mapQuerySelector(params) '

| searching for most recent

'function populateMostRecent()'

will need to be able to limit and let one page at a time come in
