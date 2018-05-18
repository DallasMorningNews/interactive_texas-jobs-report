#!/bin/bash
set -e

### Configuration ###

SERVER=ubuntu@52.5.68.162
APP_DIR=/var/www/texas-jobs-report
KEYFILE=~/.ssh/dmnapps.pem
REMOTE_SCRIPT_PATH=/tmp/deploy-texas-jobs-report.sh


### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}


### Automation steps ###

if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i $KEYFILE"
else
  KEYARG=
fi

run scp $KEYARG deploy/worker.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on production server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH
