# Goless.com Captcha solver

## Usage
```js
const GolessCaptchaSolver = require('../solver.js');

const solver = new GolessCaptchaSolver({
	token: 'y0ur-ap1-t0ken',
	limit: 10, // 10 seconds to pass test
});

const guess = await solver.solve({
	image: 'base64 encoded image...',
})
```

`<script type="module" src="....js"></script>`