const AWS = require("aws-sdk");

const CwLogger = (groupName, streamName) => {
  const sequenceToken = {
    error: null,
    debug: null
  };
  const cloudwatch = new AWS.CloudWatchLogs({
    apiVersion: "2014-03-28",
    region: "us-west-2"
  });
  const initLogGroup = async () => {
    try {
      const logGroup = await cloudwatch
        .describeLogGroups({
          logGroupNamePrefix: groupName
        })
        .promise();
      console.log(logGroup);
      if (logGroup.logGroups.length == 0) {
        const newLogGroup = await cloudwatch
          .createLogGroup({
            logGroupName: groupName
          })
          .promise();
        console.log(newLogGroup);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initErrorLogStream = async () => {
    await initLogStream("[ERROR]-" + streamName);
  };

  const initDebugLogStream = async () => {
    await initLogStream("[DEBUG]-" + streamName);
  };

  const initLogStream = async (stream) => {
    try {
      const logStream = await cloudwatch
        .describeLogStreams({
          logGroupName: groupName,
          logStreamNamePrefix: stream
        })
        .promise();
      console.log(logStream);
      if (logStream.logStreams.length === 0) {
        await cloudwatch
          .createLogStream({
            logGroupName: groupName,
            logStreamName: stream
          })
          .promise();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const log = async (message, logStreamName, token) => {
    try {
      const result = await cloudwatch
        .putLogEvents({
          logEvents: [
            {
              message,
              timestamp: Date.now()
            }
          ],
          logGroupName: groupName,
          logStreamName,
          sequenceToken: token
        })
        .promise();
      return result;
    } catch (e) {
      console.log(message, logStreamName, token, e);
    }
  };

  const debugLog = async (message) => {
    if (typeof message === "object") message = JSON.stringify(message);
    const result = await log(
      message,
      "[DEBUG]-" + streamName,
      sequenceToken.debug
    );
    sequenceToken.debug = result.nextSequenceToken;
  };

  const errorLog = async (message) => {
    if (typeof message === "object") message = JSON.stringify(message);
    const result = await log(
      message,
      "[ERROR]-" + streamName,
      sequenceToken.error
    );
    sequenceToken.error = result.nextSequenceToken;
  };

  return {
    initLogger: async () => {
      await initLogGroup();
      await initErrorLogStream();
      await initDebugLogStream();
    },
    debugLog,
    errorLog
  };
};

module.exports = { CwLogger };
