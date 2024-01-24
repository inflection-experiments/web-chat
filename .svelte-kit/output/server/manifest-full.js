export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Arnold.jpeg","Mb.jpg","Rk.jpeg","Rock.jpeg","chat.png","favicon.png","fonts/AbrilFatface.ttf","fonts/PlayfairDisplay-Italic.ttf","fonts/Quicksand.ttf","fonts/SpaceGrotesk.ttf","img.png","pdf.png"]),
	mimeTypes: {".jpeg":"image/jpeg",".jpg":"image/jpeg",".png":"image/png",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.YhACYN2g.js","app":"_app/immutable/entry/app.VKmOjdBQ.js","imports":["_app/immutable/entry/start.YhACYN2g.js","_app/immutable/chunks/scheduler.TWGjDvlj.js","_app/immutable/chunks/singletons.xDeY6uKy.js","_app/immutable/chunks/index.qWKiGvWb.js","_app/immutable/entry/app.VKmOjdBQ.js","_app/immutable/chunks/scheduler.TWGjDvlj.js","_app/immutable/chunks/index.2SPSsnUD.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
