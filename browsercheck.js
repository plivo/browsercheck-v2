window.PlivoCheck = class PlivoCheck {
	constructor() {
		this._version = "2.0";
		BrowserDetect.init();
		this.browser = BrowserDetect.browser;
		this.browserVersion = BrowserDetect.version;
		this.browserFullVersion = BrowserDetect.fullVersion;
		this.OS = BrowserDetect.OS;
		this.fullOS = BrowserDetect.fullOS;
	}

	// return the version
	version() {
		return this._version;
	}
	// verify the browser supports Websocket with a function checkWebSocket
	checkWebSocket() {
		if ("WebSocket" in window) {
			if (typeof(WebSocket) == "function") {
				return true;
			}
		}
		return false;
	}
	// verify the browser supports Flash with a function checkFlash
	checkFlash() {
		console.log("checkFlash function is deprecated.");
		return false;
	}
	// get the Flash version with a function getFlashVer
	getFlashVer() {
		console.log("getFlashVer function is deprecated.");
		return "0.0.0";
	}
	// verify the browser with a function checkBrowser
	checkBrowser() {
		return [this.browser, this.browserFullVersion];
	}
	// verify the OS with a function checkOS
	checkOS() {
		return this.OS;
	}
	// verify the browser suports the microphone with a function checkMic
	checkMic() {
		console.log("checkMic function is deprecated.");
		return true;
	}
	// verify the browser supports WebRTC with a function checkWebRTC
	checkWebRTC() {
		var webrtc_support = navigator.mediaDevices.getUserMedia || navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || window.RTCPeerConnection || window.PeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
		if (!webrtc_support) {
			return false;
		}
		return true;
	}
	// verify the browser supports mediaDevices with a function checkMediaDevices
	checkMediaDevices() {
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			return true;
		}
		return false;
	}
	// list the media devices with a function listMediaDevices
	// return a Promise
	listMediaDevices() {
		if (!this.checkMediaDevices()) {
			return Promise.reject("MediaDevices not supported"); 
		} else {
			return navigator.mediaDevices.enumerateDevices();
		}
	}
}

// BrowserDetect
// Author Alex Ho
// Code: https://gist.github.com/mralexho/d28fb26dc6787b86522f
var BrowserDetect = {
	init: function() {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) ||
			this.searchVersion(navigator.appVersion) ||
			"an unknown version";
		this.fullVersion = this.searchFullVersion(navigator.userAgent) ||
			this.searchVersion(navigator.appVersion) ||
			"an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
		this.fullOS = this.searchOSVersion() || undefined;
	},
	searchString: function(data) {
		for (var i=0;i<data.length;i++) {
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchOSVersion: function() {
		var colonIndex,endIndex,closeIndex;
		var osIndex = navigator.userAgent.indexOf(this.OS);
		endIndex = closeIndex = navigator.userAgent.indexOf(')', osIndex);
		if (this.OS == 'Windows') {
			colonIndex = navigator.userAgent.indexOf(';', osIndex);
			if (colonIndex > 0) {
				endIndex = colonIndex < closeIndex ? colonIndex:closeIndex;
			}
		}
		return navigator.userAgent.substring(osIndex, endIndex);
	},
	searchVersion: function(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	searchFullVersion: function(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		var temp = dataString.substring(index+this.versionSearchString.length+1);
		var spaceIndex = temp.indexOf(' ');
		if (spaceIndex <= 0) {
			return temp;
		}
		var fullVersion = temp.substring(0, spaceIndex);
		return fullVersion;
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{
			// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "MacOS"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPad"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
};

