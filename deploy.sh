#!/bin/bash
set -e -x

(cd frontend && yarn build)
yarn firebase deploy --only functions,firestore,hosting
