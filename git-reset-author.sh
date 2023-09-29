#!/bin/sh

# Credits: http://stackoverflow.com/a/750191

git filter-branch -f --env-filter "GIT_AUTHOR_NAME='DejanTeofilovic' GIT_AUTHOR_EMAIL='dejanteofilovic2@gmail.com' GIT_COMMITTER_NAME='DejanTeofilovic' GIT_COMMITTER_EMAIL='dejanteofilovic2@gmail.com'" HEAD