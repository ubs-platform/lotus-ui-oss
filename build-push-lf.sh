export IMAGE_NAME='hcangunduz/tk-lotus-frontend'
export IMAGE_TAG='latest'
export DOCKER_FILE="./dockerfile-lotus-front"
docker build --file ${DOCKER_FILE} -t ${IMAGE_NAME}:${IMAGE_TAG} .
docker push ${IMAGE_NAME}:${IMAGE_TAG}