#! /bin/bash
READLINK=$(command -v greadlink || command -v readlink)
SCRIPT_PATH="$( $READLINK -m "$(dirname "$0")" )"
cd $SCRIPT_PATH/.. || exit -1
export SSH_USER=root
export SSH_HOST=activepieces.lan
export DOCKER_PATH=/opt/activepieces
export DOCKER_CONTAINER=activepieces

ssh $SSH_USER@$SSH_HOST 'cd $SSH_PATH;su $SSH_CONTAINER -s /bin/bash -c "docker compose logs -n 500 $SSH_CONTAINER"' > errorlog.txt 2>&1

