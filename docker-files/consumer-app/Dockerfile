FROM node:alpine3.10
RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

RUN git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git 
WORKDIR /streaming-neo4j-msk-neptune/msk-consumer-app
RUN npm install
CMD ["node","index.js"]




