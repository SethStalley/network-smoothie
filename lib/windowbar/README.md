# windowbar

Emulate OS X and Windows 10 window title bar. Based on [kapetan/titlebar](https://github.com/kapetan/titlebar). See the [demo](http://katacarbix.xyz/windowbar/demo/index.html).

NOTE: A React component version is available [here](https://github.com/katacarbix/windowbar/tree/windowbar-react).

`npm install windowbar`

# Usage

For use in browserify, electron, or a similar environment. Plain javascript:

```javascript
var windowbar = require('windowbar');

var wb = new windowbar({'style':'mac', 'dblClickable':false})
	.on('close', console.log('close'))
	.on('minimize', console.log('minimize'))
	.on('fullscreen', console.log('fullscreen'))
	.on('maximize', console.log('maximize'))
	.appendTo(document.body);
```

The returned instance emits four events: `close`, `minimize`, `maximize`, and `fullscreen`. Note: `maximize` can also be triggered in the Mac style by alt-clicking fullscreen.

The initializer function accepts an options object with these properties:

* `draggable` (default `true`): Disable the [-webkit-app-region](https://developer.chrome.com/apps/app_window) CSS property on the root element. Allows frameless windows to be dragged in an `electron` application.
* `dblClickable` (default `true`): Allows double clicking windowbar to trigger maximize event.
* `style` (defaults to current OS, or `generic` if unrecognized): Possible values are `mac`, `win`, or `generic`.
* `dark` (default `false`): Dark theme for Windows.

# To do

* Add generic style (similar to [hyper](http://hyper.is))
