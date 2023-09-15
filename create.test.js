const { expect } = require("chai");
const AWS = require("aws-sdk");
const sinon = require("sinon");
const { create } = require("./create.js"); // Replace with your Lambda file path

describe("create Lambda Function", () => {
  let putStub;

  before(() => {
    // Stub the DocumentClient's put method
    putStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, "put");
  });

  after(() => {
    // Restore the stub after tests
    putStub.restore();
  });

  it("should successfully create a blog post", async () => {
    // Mock the successful put operation
    putStub.returns({
      promise: () => Promise.resolve({}),
    });

    const event = {
      body: JSON.stringify({
        postId: "1",
        Author: "John Doe",
        Content: "Sample content",
        Title: "Sample title",
      }),
    };

    const result = await create(event);

    expect(result.statusCode).to.equal(200);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: "Blog post created successfully",
    });
  });

  it("should handle a failure to create a blog post", async () => {
    // Mock the failed put operation
    putStub.returns({
      promise: () => Promise.reject(new Error("Failed to create post")),
    });

    const event = {
      body: JSON.stringify({
        postId: 2,
        Author: 3,
        Content: 4,
        Title: 9,
      }),
    };

    const result = await create(event);

    expect(result.statusCode).to.equal(500);
    expect(JSON.parse(result.body)).to.deep.equal({
      error: "Failed to create blog post",
    });
  });
});

