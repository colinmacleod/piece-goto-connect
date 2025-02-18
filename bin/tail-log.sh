#! /bin/bash
READLINK=$(command -v greadlink || command -v readlink)
SCRIPT_PATH="$( $READLINK -m "$(dirname "$0")" )"
cd $SCRIPT_PATH/.. || exit -1

ssh root@activepieces.lan 'cd /opt/activepieces;su activepieces -s /bin/bash -c "docker compose logs -n 50 activepieces"' > errorlog.txt 2>&1

