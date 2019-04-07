DEFAULT_COMMIT_MSG=fix

if [[ $1 != "" ]];
then
    git add .
    git commit -m "${1:-$DEFAULT_COMMIT_MSG}"
    git push
fi

npm run deploy