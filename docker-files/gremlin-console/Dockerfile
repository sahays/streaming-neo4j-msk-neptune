FROM tinkerpop/gremlin-console:3.4.5

WORKDIR /opt/gremlin-console/conf
# configure Amazon Neptune
RUN touch neptune-remote.yaml
RUN echo "hosts: ['abcd']" >> neptune-remote.yaml
RUN echo "port: '8080'" >> neptune-remote.yaml
RUN echo 'connectionPool: { enableSsl: true, trustCertChainFile: "SFSRootCAG2.pem"}' >> neptune-remote.yaml
RUN echo 'serializer: { className: org.apache.tinkerpop.gremlin.driver.ser.GryoMessageSerializerV3d0, config: { serializeResultToString: true }}' >> neptune-remote.yaml
