const AWS = require('aws-sdk');

const chai = require('chai');
const expect = chai.expect;


const { get } = require('./get.js'); 

describe('get Lambda Function', () => {
    let getStub;

    before(() => {
        
        getStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get');
    });

    after(() => {
        
        getStub.restore();
    });

    it('should return a blog post when it exists', async () => {
        const event = {
            pathParameters: {
                postId: '11',
            },
        };

        
        AWSMock.mock('DynamoDB.DocumentClient', 'get', { Item: { postId: '909', title: 'twelve' } });

        const response = await get(event);

        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal('{"postId":"909","title":"twelve"}');
    });

    it('should return a 404 error when the blog post does not exist', async () => {
        const event = {
            pathParameters: {
                postId: '99',
            },
        };

   
        AWSMock.mock('DynamoDB.DocumentClient', 'get', {});

        const response = await get(event);

        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal('{"message":"Blog post not found"}');
    });

    it('should return a 500 error when an error occurs', async () => {
        const event = {
            pathParameters: {
                postId: 'etr',
            },
        };

        
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            callback(new Error('Simulated error'));
        });

        const response = await get(event);

        expect(response.statusCode).to.equal(500);
        expect(response.body).to.equal('{"message":"Error reading blog post"}');
    });
});
