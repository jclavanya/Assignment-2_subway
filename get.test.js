const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const { get } = require('./get.js'); // Replace with your Lambda file path

describe('get Lambda Function', () => {
  let getStub;

  before(() => {
    // Stub the DocumentClient's get method
    getStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get');
  });

  after(() => {
    // Restore the stub after tests
    getStub.restore();
  });

  it('should successfully retrieve a blog post', async () => {
    // Mock a successful DynamoDB get operation
    getStub.returns({
      promise: () => Promise.resolve({ Item: { postId: '1', Author: 'John Doe', Content: 'Sample content', Title: 'Sample title' } }),
    });

    const event = {
      pathParameters: { postId: '1' },
    };

    const result = await get(event);

    expect(result.statusCode).to.equal(200);
    expect(JSON.parse(result.body)).to.deep.equal({
      postId: '1',
      Author: 'John Doe',
      Content: 'Sample content',
      Title: 'Sample title',
    });
  });

  it('should handle a blog post not found', async () => {
    // Mock a DynamoDB get operation that returns no item
    getStub.returns({
      promise: () => Promise.resolve({ Item: null }),
    });

    const event = {
      pathParameters: { postId: '2' },
    };

    const result = await get(event);

    expect(result.statusCode).to.equal(404);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'Blog post not found',
    });
  });

  it('should handle an error while reading blog post', async () => {
    // Mock a failed DynamoDB get operation
    getStub.returns({
      promise: () => Promise.reject(new Error('Error reading blog post')),
    });

    const event = {
      pathParameters: { postId: '3' },
    };

    const result = await get(event);

    expect(result.statusCode).to.equal(500);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'Error reading blog post',
    });
  });
});
