import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Rekognition, DetectLabelsCommand } from '@aws-sdk/client-rekognition'
import axios from 'axios';

import { run } from '../src/handler';

import MOCK_EVENT from './__mocks__/aws-request.json';
import MOCK_REKOGNITION_RESPONSE from './__mocks__/aws-rekognition.json';

describe('Image analyser test suite', () => {
  beforeEach(() => {
    vi.spyOn(Rekognition.prototype, 'send').mockImplementation(async (command) => {
      if (command instanceof DetectLabelsCommand) {
        return MOCK_REKOGNITION_RESPONSE;
      }
      return {}
    })
  })

  it('should be able to analyse successfully the image and return the labels', async () => {
    const responseExpected = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Animal and Canine and Dog and Labrador Retriever and Mammal and Pet'
      })
    }
    const response = await run(MOCK_EVENT);
    expect(response).toStrictEqual(responseExpected);
  });

  it('should be return empty labels', async () => {
    const responseExpected = {
      statusCode: 200,
      body: JSON.stringify({
        message: ''
      })
    }

    vi.spyOn(Rekognition.prototype, 'send').mockImplementation(async (command) => {
      if (command instanceof DetectLabelsCommand) {
        return {};
      }
      return {}
    })

    const response = await run(MOCK_EVENT);
    expect(response).toStrictEqual(responseExpected);
  });

  it('should return status code 400 if given an empty queryString', async () => {
    const responseExpected = {
      statusCode: 400,
      body: 'Image URL is required!'
    }

    const response = await run({ queryStringParameters: {} });
    expect(response).toStrictEqual(responseExpected);
  });

  it('should return status code 400 if not given a valid event object', async () => {
    const responseExpected = {
      statusCode: 400,
      body: 'Query string parameters is required!'
    }

    const response = await run({});
    expect(response).toStrictEqual(responseExpected);
  });

  it('should be throw status code 500 if internal server error', async () => {
    const responseExpected = {
      statusCode: 500,
      body: 'Internal server error'
    }

    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'))

    const response = await run(MOCK_EVENT);
    expect(response).toStrictEqual(responseExpected);
  });
});