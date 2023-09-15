const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const { delete: deleteBlogPost } = require('./delete.js'); // Replace with your Lambda file path

describe('delete Lambda Function', () => {
  let deleteStub;

  before(() => {
    // Stub the DocumentClient's delete method
    deleteStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete');
  });

  after(() => {
    // Restore the stub after tests
    deleteStub.restore();
  });

  it('should successfully delete a blog post', async () => {
    // Mock a successful DynamoDB delete operation
    deleteStub.returns({
      promise: () => Promise.resolve({}),
    });

    const event = {
      body: JSON.stringify({
        postId: '1',
      }),
    };

    const result = await deleteBlogPost(event);

    expect(result.statusCode).to.equal(200);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'Deleted Successfully',
    });
  });

  it('should handle an error while deleting a blog post', async () => {
    // Mock a failed DynamoDB delete operation
    deleteStub.returns({
      promise: () => Promise.reject(new Error('Error deleting blog post')),
    });

    const event = {
      body: JSON.stringify({
        postId: '2',
      }),
    };

    const result = await deleteBlogPost(event);

    expect(result.statusCode).to.equal(500);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'Error deleting blog post',
    });
  });

  // Add more test cases here as needed for different scenarios
});
