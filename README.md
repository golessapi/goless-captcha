# Goless.com Captcha solver

## Installation
`npm i -s goless-captcha`

## Usage
```js
const GolessCaptchaSolver = require('goless-captcha');

const solver = new GolessCaptchaSolver({
	token: '	',
	limit: 10, // 10 seconds limit to solve. if not solved - throw error
});

try {
	const guess = await solver.solve({
		image: 'base64 encoded image...',
	})	
} catch (e) {
	// do something with solver error
}

```
