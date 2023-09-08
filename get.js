const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.get = async (event) => {
        const params = {
        TableName: 'posts',
        Key: {
            postId: event.postId,
        },
    };

    try {
        const data = await dynamodb.get(params).promise();
        if (data.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(data.Item),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Blog post not found' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error reading blog post' }),
        };
    }
};