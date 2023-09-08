const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
module.exports.update = async (event) => {
    // const postId = event.pathParameters.postId; // Get the postId from pathParameters
    // Check if the item exists in the DynamoDB table
    const getItemParams = {
        TableName: 'posts',
        Key: {
            postId:event.postId,
        },
    };
    try {
        const existingItem = await dynamodb.get(getItemParams).promise();
        // If the item doesn't exist, return a 404 response
        if (!existingItem.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Blog post not found' }),
            };
        }
        // Item exists, proceed with the update
        const params = {
            TableName: 'posts',
            Key: {
                postId: event.postId,
            },
            UpdateExpression: 'SET Title = :Title, Content = :Content, Author = :Author',
            ExpressionAttributeValues: {
                ':Title': event.Title,
                ':Content': event.Content,
                ':Author': event.Author,
            },
            ReturnValues: 'ALL_NEW',
        };
        const data = await dynamodb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Attributes),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating blog post' }),
        };
    }
};

 