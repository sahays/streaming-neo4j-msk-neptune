FROM node:alpine3.11

ENV AWS_REGION=us-west-2
ENV CONFIG_OUTPUT_PATH=/data/

WORKDIR /
COPY run-script.sh .
RUN chmod +x run-script.sh
RUN apk add git
