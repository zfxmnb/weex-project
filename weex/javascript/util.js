
module.exports = {
	path:function(me,relaPath){
		var bundleUrl = me.$getConfig().bundleUrl;
		bundleUrl = new String(bundleUrl);
		var nativeBase;

		var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;

		var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;

		if (isAndroidAssets) {
			nativeBase = 'file://assets/';
		}
		else if (isiOSAssets) {
			nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
		}
		else {
			
			//console.log("--------------->"+relaPath.match(reg))
			nativeBase=bundleUrl;
			if(relaPath.indexOf("../")!=-1){
				var reg = new RegExp("../", "g");
				var c=relaPath.match(reg).length;

				for(var i=0;i<c+1;i++){
					nativeBase = nativeBase.substring(0, nativeBase.lastIndexOf('/'));
				}
				var rela=relaPath.substring(relaPath.lastIndexOf("../")+2, relaPath.length);
				nativeBase=nativeBase+rela;
			}else{
				nativeBase = nativeBase.substring(0, nativeBase.lastIndexOf('/')+1)+relaPath;
			}
			/*var host = 'localhost:12580';
			var matches = /\/\/([^\/]+?)\//.exec(me.$getConfig().bundleUrl);
			if (matches && matches.length >= 2) {
			  host = matches[1];
			}*/
			console.log("-->"+nativeBase)
			//nativeBase = 'http://' + host + '/' + me.dir + '/build/';
		}

		var h5Base = bundleUrl;
		// in Native
		var base = nativeBase;
		if (typeof window == 'object') {
			// in Browser or WebView
			base = relaPath;
		}
		//console.log("-->"+base)
		return base;

	}
}