#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git config --global user.email "jakub.matejik@centrum.cz"
git config --global user.name "matejikj"

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:matejikj/similarity_visualisation.git master:gh-pages

cd -
