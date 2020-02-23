FROM amazonlinux:2

ENV NEO4J_HOME="/var/lib/neo4j"

RUN rpm --import https://debian.neo4j.com/neotechnology.gpg.key \
    && echo [neo4j] >> /etc/yum.repos.d/neo4j.repo \
    && echo name=Neo4j RPM Repository >> /etc/yum.repos.d/neo4j.repo \
    && echo baseurl=https://yum.neo4j.com/stable >> /etc/yum.repos.d/neo4j.repo \
    && echo enabled=1 >> /etc/yum.repos.d/neo4j.repo \
    && echo gpgcheck=1 >> /etc/yum.repos.d/neo4j.repo \
    && amazon-linux-extras enable java-openjdk11 \
    && yum install neo4j-4.0.0 -y \
    && echo NEO4J_ULIMIT_NOFILE=60000 >> /etc/default/neo4j \
    && echo apoc.export.file.enabled=true >> /etc/neo4j/neo4j.conf \
    && echo dbms.security.procedures.unrestricted=apoc.* >> /etc/neo4j/neo4j.conf \
    && neo4j-admin set-initial-password  pass@word1 \
    && wget --directory-prefix /var/lib/neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar \
    && cp "${JAVA_HOME}"/jre/lib/security/cacerts /tmp/kafka.client.truststore.jks

ENV PATH "${NEO4J_HOME}"/bin:$PATH

WORKDIR "${NEO4J_HOME}"

VOLUME /data /logs

EXPOSE 7474 7473 7687

CMD ["neo4j"]