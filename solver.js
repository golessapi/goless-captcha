const debug = require('debug')('goless-captcha');
const requests = require('requestretry').defaults({ timeout: 60000 });
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

class Solver {
  constructor(options) {
    this.token = options.token;
    this.limit = options.limit || 60 * 5; // 5 minutes: default time limit to solve captcha
  }

  async solve(options) {
    options = options || {};
    const backend = options.backend;
    const url = options.url;
    const body = options.image || options.body;
    
    const guess = await this.registerCaptcha({
      body,
      backend,
    });
    return guess;
  }

  async registerCaptcha(options) {
    const { body, backend } = options;

    const response = await requests.post({
      url: 'https://captcha.goless.com/api/v1/task',
      json: {
        body,
        backend,
      },
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      fullResponse: true,
      maxAttempts: 2,
      retryDelay: 5000,
    });

    if (response.statusCode !== 200) {
      throw new Error('Non 200 captcha.goless.com response');
    }

    const taskUuid = response.body.uuid;

    if (!taskUuid) {
      throw new Error('Empty captcha.goless.com task uuid');
    }

    return this.getResult(taskUuid);
  }

  async getResult(taskUuid) {
    let tryCount = this.limit;
    let status = 'processing';

    while (
      status === 'processing'
      && tryCount > 0
    ) {
      debug('waiting captcha.goless.com response...', tryCount, 'secs left to deadline');
      tryCount -= 1;
      await delay(1000);

      const response = await requests.get({
        url: `https://captcha.goless.com/api/v1/task?tag=${taskUuid}`,
        json: {},
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        fullResponse: true,
        maxAttempts: 5,
        retryDelay: 5000,
      });

      status = response.body.status;

      if (status === 'success') {
        return response.body.guess;
      }

      if (status === 'failure') {
        return '';
      }
    }

    debug('time is out - return empty string');
    return '';
  }
}

module.exports = Solver;
