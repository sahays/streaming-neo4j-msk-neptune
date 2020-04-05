# Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

FROM node:alpine3.11

ENV AWS_REGION=us-west-2
ENV SHARED_FOLDER=/data

WORKDIR /
COPY run-script.sh .
RUN chmod +x run-script.sh
RUN apk add git

# export GitTag=`git log -1 --pretty=%h` && docker image build -t sanjeets/streaming-blog-after-deploy:$GitTag .
