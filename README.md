# Architecture

![AWS Architecture](images/high-level.png)

# Prerequisites

# Launching the app

To setup the app, run the following commands:

## Download code from GitHub

```
git clone https://github.com/sahays/streaming-neo4j-msk-neptune
cd streaming-neo4j-msk-neptune/bootstrapper
```

## Review configuration file

Before launching the app, observe and make changes to `cdk.json` file inside
`streaming-neo4j-msk-neptune/bootstrapper`. You need to provide an Amazon EC2
key-value pair name replacing the placeholder text `<your-ec2-key-pair-name>`

```
{
  "app": "node bin/bootstrapper.js",
  "context": {
    "vpc_cidr": "192.168.0.0/16",
    "ec2_class": "t3a",
    "ec2_type": "xlarge",
    "ec2_key_pair": "<your-ec2-key-pair-name>",
    "sg_fromIp": "0.0.0.0/0"
  }
}
```

## Deploy

After making changing to the file, run the following commands to launch:

```
npm install
npm run deploy
```

After successful run of the program (it takes about 10 minutes to complete),
you'll see an output similar to the following:
![EC2 output](images/ec2-output.png)

| Variable                    | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| .VpcID                      | Amazon VPC Id that contains all the resources  |
| .MSKCluster                 | Amazon Managed Service for Kafka cluster ARN   |
| .EC2Instance                | Amazon EC2 instance Id                         |
| .NeptuneDbClusterIdentifier | Cluster name for the Amazon Neptune DB cluster |
| .NeptuneClusterEndpoint     | Endpoint of the Amazon Neptune DB cluster      |

## Detailed architecture

![EC2 output](images/services.png)

## Post deploy steps

SSH into the Amazon EC2 instances created by the app. To see a list of all
running containers run the following command:

```
docker container ls -a
```

You should be able to see the following 3 docker container services:

| Service name           | Purpose                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| transformation-service | runs the transformation engine that transforms Neo4j data to Amazon Neptune data format      |
| neo4j-service          | runs the Neo4j graph database version 3.5.6                                                  |
| startup-service        | runs the startup docker that fetches endpoint information from Amazon Neptune and Amazon MSK |
| kafka-topic-service    | creates a new topic in Amazon MSK                                                            |

If you want to see logs for a service, run the following command:

```
docker container logs <service-name>
```

# Cleaning up

To cleanup AWS resources you need to run the following command:

```
npm run destroy
```
