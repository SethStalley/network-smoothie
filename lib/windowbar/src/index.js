var EventEmitter = require('events');
var fs = require('fs');
var path = require('path');
var defaultCss = require('defaultcss');
var domify = require('domify');
var classes = require('component-classes');

var ALT = 18;

var html = function(s = ''){
	if (s === 'mac'){
		return `<div class="windowbar wb-mac"><div class="windowbar-controls">
		<div class="windowbar-close"><svg x="0px" y="0px" viewBox="0 0 6 6"><polygon fill="#860006" points="6,1 6,0 5,0 3,2 1,0 0,0 0,1 2,3 0,5 0,6 1,6 3,4 5,6 6,6 6,5 4,3"></polygon></svg></div>
		<div class="windowbar-minimize"><svg x="0px" y="0px" viewBox="0 0 7 2"><rect fill="#9d5615" width="7" height="2"></rect></svg></div>`;
	} else if (s === 'win') {
		return `<div class="windowbar wb-win"><div class="windowbar-controls">
		<div class="windowbar-minimize"><svg x="0px" y="0px" viewBox="0 0 10 1"><rect fill="#000000" width="10" height="1"></rect></svg></div>
		</div><div class="windowbar-close"><svg x="0px" y="0px" viewBox="0 0 12 12"><polygon fill="#000000" points="12,1 11,0 6,5 1,0 0,1 5,6 0,11 1,12 6,7 11,12 12,11 7,6"></polygon></svg></div></div></div>`;
	}
}
var css = function(){
	return `.windowbar{display:flex;box-sizing:content-box}.windowbar *{box-sizing:inherit}.windowbar::after{content:' ';display:table;clear:both}.windowbar.draggable{-webkit-app-region:drag}.windowbar.draggable .windowbar-minimize,.windowbar.draggable .windowbar-maximize,.windowbar.draggable .windowbar-close{-webkit-app-region:no-drag}.windowbar .windowbar-controls::after{content:' ';display:table;clear:both}.windowbar.wb-mac{align-items:center;justify-content:space-between;padding:0 3px}.windowbar.wb-mac:not(.transparent){background-color:#e5e5e5}.windowbar.wb-mac.unfocused:not(.transparent){background-color:#f6f6f6}.windowbar.wb-mac .windowbar-controls:hover svg{opacity:1 !important}.windowbar.wb-mac.alt:not(.fullscreen) svg.fullscreen-svg{display:none}.windowbar.wb-mac.alt:not(.fullscreen) svg.maximize-svg{display:block !important}.windowbar.wb-mac.fullscreen svg.fullscreen-svg{display:none}.windowbar.wb-mac.fullscreen svg.exit-fullscreen-svg{display:block !important}.windowbar.wb-mac .windowbar-close,.windowbar.wb-mac .windowbar-minimize,.windowbar.wb-mac .windowbar-maximize{float:left;width:10px;height:10px;border-radius:50%;margin:6px 4px;line-height:0}.windowbar.wb-mac .windowbar-close{border:1px solid #e94343;background-color:#ff5d5b;margin-left:6px}.windowbar.wb-mac .windowbar-close:active{border-color:#b43737;background-color:#c64845}.windowbar.wb-mac .windowbar-close svg{width:6px;height:6px;margin-top:2px;margin-left:2px;opacity:0}.windowbar.wb-mac .windowbar-minimize{border:1px solid #e5a03a;background-color:#ffbc45}.windowbar.wb-mac .windowbar-minimize:active{border-color:#b07b2e;background-color:#c38e34}.windowbar.wb-mac .windowbar-minimize svg{width:8px;height:8px;margin-top:1px;margin-left:1px;opacity:0}.windowbar.wb-mac .windowbar-maximize{border:1px solid #13ad3e;background-color:#00c94f}.windowbar.wb-mac .windowbar-maximize:active{border-color:#138532;background-color:#009a3c}.windowbar.wb-mac .windowbar-maximize svg.fullscreen-svg{width:6px;height:6px;margin-top:2px;margin-left:2px;opacity:0}.windowbar.wb-mac .windowbar-maximize svg.exit-fullscreen-svg{width:10px;height:10px;margin-top:0;margin-left:0;opacity:0;display:none}.windowbar.wb-mac .windowbar-maximize svg.maximize-svg{width:8px;height:8px;margin-top:1px;margin-left:1px;opacity:0;display:none}.windowbar.wb-mac.unfocused .windowbar-controls:not(:hover)>*{background-color:#dcdcdc;border-color:#d1d1d1}.windowbar.wb-win{justify-content:flex-end;padding:0}.windowbar.wb-win:not(.transparent){background-color:#fff}.windowbar.wb-win.unfocused .windowbar-controls:not(:hover) svg{opacity:60%}.windowbar.wb-win .windowbar-minimize,.windowbar.wb-win .windowbar-maximize,.windowbar.wb-win .windowbar-close{float:left;width:45px;height:29px;margin:0 0 1px 1px;text-align:center;line-height:29px;-webkit-transition:background-color .2s;-moz-transition:background-color .2s;-ms-transition:background-color .2s;-o-transition:background-color .2s;transition:background-color .2s}.windowbar.wb-win .windowbar-minimize svg,.windowbar.wb-win .windowbar-maximize svg,.windowbar.wb-win .windowbar-close svg{width:10px;height:10px}.windowbar.wb-win .windowbar-close svg polygon{-webkit-transition:fill .2s;-moz-transition:fill .2s;-ms-transition:fill .2s;-o-transition:fill .2s;transition:fill .2s}.windowbar.wb-win.fullscreen .windowbar-minimize,.windowbar.wb-win.fullscreen .windowbar-maximize,.windowbar.wb-win.fullscreen .windowbar-close{height:21px;line-height:21px}.windowbar.wb-win:not(.fullscreen) .windowbar-maximize svg.unmaximize-svg{display:none}.windowbar.wb-win.fullscreen .windowbar-maximize svg.maximize-svg{display:none}.windowbar.wb-win .windowbar-minimize:hover,.windowbar.wb-win .windowbar-maximize:hover{background-color:rgba(127,127,127,0.2)}.windowbar.wb-win .windowbar-close:hover{background-color:#E81123}.windowbar.wb-win .windowbar-close:hover svg polygon{fill:#fff}.windowbar.wb-win.dark:not(.transparent){background-color:#1f1f1f}.windowbar.wb-win.dark svg>rect,.windowbar.wb-win.dark svg>polygon,.windowbar.wb-win.dark svg>path{fill:#fff}`;
}

class Windowbar extends EventEmitter {
	constructor(options = {}){
		super();
		// Get Options
		this.options = {};
		this.options.style = options.style;
		this.options.transparent = options.transparent;
		this.options.dark = options.dark;
		this.options.draggable = "draggable" in options ? options.draggable : true;
		this.options.dblClickable = "dblClickable" in options ? options.dblClickable : true;
		
		// Set proper style
		if (!['mac','win','generic'].includes(this.options.style)){
			if (this.options.style === 'darwin' || process.platform === 'darwin') this.options.style = 'mac';
			else if (this.options.style === 'win32' || process.platform === 'win32') this.options.style = 'win';
			else this.options.style = 'generic';
		}
		
		// Create Windowbar element
		this.element = domify(html(this.options.style), document);
		
		// Register buttons
		this.minimizeButton = this.element.querySelector('.windowbar-minimize');
		this.closeButton = this.element.querySelector('.windowbar-close');
		
		// Draggable
		if (this.options.draggable) classes(this.element).add('draggable');
		// Transparent
		if (this.options.transparent) classes(this.element).add('transparent');
		// Dark mode
		if (this.options.dark) classes(this.element).add('dark');
		
		// Add click events
		this.element.addEventListener('dblclick', event => this.onDblClick(event));
		this.minimizeButton.addEventListener('click', event => this.clickMinimize(event));
		this.closeButton.addEventListener('click', event => this.clickClose(event));
		
		// Show maximize svg while holding alt (mac only)
		if (this.options.style === 'mac'){
			var self = this;
			window.addEventListener('keydown', function(e){
				if(e.keyCode === ALT) classes(self.element).add('alt');
			});
			window.addEventListener('keyup', function(e){
				if(e.keyCode === ALT) classes(self.element).remove('alt');
			});
		}
	}
	
	clickClose(e){ this.emit('close', e); };
	
	clickMinimize(e){ this.emit('minimize', e); };
	
	clickMaximize(e){
		if (this.options.style === 'mac'){
			if (e.altKey && !classes(this.element).has('fullscreen')) this.emit('maximize', e);
			else {
				classes(this.element).toggle('fullscreen');
				this.emit('fullscreen', e);
			}
		} else {
			classes(this.element).toggle('fullscreen');
			this.emit('maximize', e);
		}
	};
	
	onDblClick(e){
		e.preventDefault;
		if (this.options.dblClickable && !(this.minimizeButton.contains(e.target) || this.maximizeButton.contains(e.target) || this.closeButton.contains(e.target))){
			this.clickMaximize(e);
			console.log('dblclick', e);
		}
	};
	
	appendTo(context = document.body){
		defaultCss('windowbar', css());
		context.appendChild(this.element);
		return this;
	};
	
	destroy(){
		return this;
	};
}

module.exports = Windowbar;
