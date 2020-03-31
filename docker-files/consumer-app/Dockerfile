FROM node:alpine3.10
RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY run-script.sh /

RUN chmod +x /run-script.sh

CMD ["/run-script.sh"]




