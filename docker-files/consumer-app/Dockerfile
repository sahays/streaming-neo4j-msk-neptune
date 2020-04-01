FROM node:alpine3.10
RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

ADD https://raw.githubusercontent.com/sahays/streaming-neo4j-msk-neptune/master/docker-files/consumer-app/run-script.sh /
RUN chmod +x /run-script.sh



