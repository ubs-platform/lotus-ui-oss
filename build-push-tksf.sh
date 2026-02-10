export IMAGE_NAME='hcangunduz/tk-santral-frontend'
export IMAGE_TAG='latest'
export DOCKER_FILE="./dockerfile-santral-front"
docker build --file ${DOCKER_FILE} -t ${IMAGE_NAME}:${IMAGE_TAG} .
docker push ${IMAGE_NAME}:${IMAGE_TAG}
