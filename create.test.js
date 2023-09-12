const AWS = require("aws-sdk");
const chai = require("chai");
const { expect } = chai;

const docClient = new AWS.DynamoDB.DocumentClient();

const handler = require("./create.js"); 

describe("Create Blog Post Lambda Function", () => {
  it("should create a new blog post", async () => {
    const event = {
      body: JSON.stringify({
        postId: "123",
        Author: "John Doe",
        Content: "This is a test blog post",
        Title: "Test Blog Post",
      }),
    };

    const response = await handler.create(event);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.equal(JSON.stringify({ message: "Blog post created successfully" }));

    // Clean up: Delete the created item from DynamoDB
    const params = {
      TableName: "posts", // Replace with your DynamoDB table name
      Key: { postId: "123" }, // Match the postId used above
    };

    await docClient.delete(params).promise();
  });

  it("should handle errors when creating a blog post", async () => {
    const event = {
      body: JSON.stringify({
        // Invalid data to trigger an error
      }),
    };

    const response = await handler.create(event);

    expect(response.statusCode).to.equal(500);
    expect(response.body).to.equal(JSON.stringify({ error: "Failed to create blog post" }));
  });
});
