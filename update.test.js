const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const { update } = require('./update.js'); // Replace with your Lambda file path

describe('update Lambda Function', () => {
  let getStub;
  let updateStub;

  before(() => {
    // Stub the DocumentClient's get and update methods
    getStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get');
    updateStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'update');
  });

  after(() => {
    // Restore the stubs after tests
    getStub.restore();
    updateStub.restore();
  });

  it('should successfully update a blog post', async () => {
    // Mock a successful DynamoDB get operation
    getStub.returns({
      promise: () =>
        Promise.resolve({
          Item: {
            postId: '1',
            Author: 'John Doe',
            Content: 'Sample content',
            Title: 'Sample title',
          },
        }),
    });

    // Mock a successful DynamoDB update operation
    updateStub.returns({
      promise: () =>
        Promise.resolve({
          Attributes: {
            postId: '1',
            Author: 'Updated Author',
            Content: 'Updated content',
            Title: 'Updated title',
          },
        }),
    });

    const event = {
      body: JSON.stringify({
        postId: '1',
        Author: 'Updated Author',
        Content: 'Updated content',
        Title: 'Updated title',
      }),
    };

    const result = await update(event);

    expect(result.statusCode).to.equal(200);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'updated successfully',
    });
  });

  it('should handle updating a non-existent blog post', async () => {
    // Mock a DynamoDB get operation that returns no item
    getStub.returns({
      promise: () => Promise.resolve({ Item: null }),
    });

    const event = {
      body: JSON.stringify({
        postId: '2',
        Author: 'Updated Author',
        Content: 'Updated content',
        Title: 'Updated title',
      }),
    };

    const result = await update(event);

    expect(result.statusCode).to.equal(404);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'Blog post not found',
    });
  });

  it('should handle an error while updating a blog post', async () => {
    // Mock a failed DynamoDB get operation
    getStub.returns({
      promise: () =>
        Promise.resolve({
          Item: {
            postId: '3',
            Author: 'John Doe',
            Content: 'Sample content',
            Title: 'Sample title',
          },
        }),
    });

    // Mock a failed DynamoDB update operation
    updateStub.returns({
      promise: () => Promise.reject(new Error('Error updating blog post')),
    });

    const event = {
      body: JSON.stringify({
        postId: '3',
        Author: 'Updated Author',
        Content: 'Updated content',
        Title: 'Updated title',
      }),
    };

    const result = await update(event);

    expect(result.statusCode).to.equal(500);
    expect(JSON.parse(result.body)).to.deep.equal({
      message: 'Error updating blog post',
    });
  });
});
