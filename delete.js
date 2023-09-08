const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
module.exports.delete = async (event) => {
    // const postId = event.pathParameters.postId;
    const params = {
        TableName: 'posts',
        Key: {
            postId: event.postId,
        },
    };
    try {
        await dynamodb.delete(params).promise();
        return {
            statusCode: 204, // No content
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error deleting blog post' }),
        };
    }
};