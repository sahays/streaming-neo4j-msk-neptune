FROM node:alpine3.11

ENV AWS_REGION=us-west-2
ENV CONFIG_OUTPUT_PATH=/data/

WORKDIR /
ADD https://raw.githubusercontent.com/sahays/streaming-neo4j-msk-neptune/master/docker-files/after-deploy/run-script.sh .
RUN chmod +x run-script.sh
RUN apk add git
