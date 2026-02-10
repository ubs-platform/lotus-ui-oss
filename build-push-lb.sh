export IMAGE_NAME='hcangunduz/tk-lotus-backend'
export IMAGE_TAG='latest'
export DOCKER_FILE="./dockerfile-lotus-backend"
docker build --no-cache --file ${DOCKER_FILE} -t ${IMAGE_NAME}:${IMAGE_TAG} .
docker push ${IMAGE_NAME}:${IMAGE_TAG}
