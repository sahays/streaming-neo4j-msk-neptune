FROM neo4j:4.0.0

# RUN wget --directory-prefix /var/lib/neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar
RUN cat /var/lib/neo4j/conf/neo4j.conf

EXPOSE 7473 7474 7687

VOLUME [/data /logs]

WORKDIR /var/lib/neo4j

CMD ["neo4j"]