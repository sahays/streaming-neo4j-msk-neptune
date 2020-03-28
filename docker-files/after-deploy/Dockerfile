FROM node:alpine3.11

ENV AWS_REGION=us-west-2

WORKDIR /
RUN apk add git -y
RUN git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git

WORKDIR /streaming-neo4j-msk-neptune/bootstrapper/lib/direct/
RUN node describe-stacks.js
RUN node after-deploy.js

# docker build image -t sanjeets/streaming-blog-after-deploy