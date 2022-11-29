# Phonebook backend

## 2022-11-29

This was an old course project. Very old, very deprecated notes follow. The
heroku instance is probably dead as of now as well, since they nuked their free
tier at some point along the way.

## Old notes

For convenience, there is an instance running at
https://whispering-peak-27579.herokuapp.com/

The frontend code is at https://github.com/meklu/uni-fullstack under
`osa2/puhelinluettelo`. Note that the frontend has its own validation in
addition to displaying possible validation errors from the server, preventing
malformed data being recycled via the backend thus giving the old validation
messages from the part2 era. The backend of course responds reasonably with an
error message if invalid data is sent its way.

To see backend validation errors on the frontend, one could e.g. remove an
entry with a given name in one tab, add it via another tab and try to re-add an
entry with the same name from the original tab. This will render a uniqueness
validation error in the browser window.
