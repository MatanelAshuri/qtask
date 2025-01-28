#!/bin/bash
set -e

cd /usr/src/app/app1
npm start &
cd /usr/src/app/app2
npm start &

wait -n

exit $?
