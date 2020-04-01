FROM neo4j:4.0.0

ENV NEO4J_AUTH=neo4j/pass@word1
ENV NODE_TOPIC="REPLACE_NODE_TOPIC"
ENV RELS_TOPIC="REPLACE_RELS_TOPIC"
ENV ZOOKEEPER_CONNECT="REPLACE_ZOOKEEPER_CONNECT"
ENV BOOTSTRAP_SERVERS="REPLACE_BOOTSTRAP_SERVERS"

RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar 
RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-streams/releases/download/3.5.4/neo4j-streams-3.5.4.jar 

COPY run-script.sh /
RUN chmod +x /run-script.sh

EXPOSE 7473 7474 7687