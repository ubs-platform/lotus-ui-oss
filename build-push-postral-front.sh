export IMAGE_NAME='hcangunduz/tk-postral-core-frontend'
export IMAGE_TAG='1.0.2-beta'
export DOCKER_FILE="./dockerfile-postral-core-front"
docker build --file ${DOCKER_FILE} -t ${IMAGE_NAME}:${IMAGE_TAG} .
docker push ${IMAGE_NAME}:${IMAGE_TAG}
