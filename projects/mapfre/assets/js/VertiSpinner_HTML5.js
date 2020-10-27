(function (cjs, an) {

	var p; // shortcut to reference prototypes
	var lib = {}; var ss = {}; var img = {};
	lib.ssMetadata = [];


	// symbols:
	// helper functions:

	function mc_symbol_clone() {
		var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
		clone.gotoAndStop(this.currentFrame);
		clone.paused = this.paused;
		clone.framerate = this.framerate;
		return clone;
	}

	function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
		var prototype = cjs.extend(symbol, cjs.MovieClip);
		prototype.clone = mc_symbol_clone;
		prototype.nominalBounds = nominalBounds;
		prototype.frameBounds = frameBounds;
		return prototype;
	}


	(lib.VERTI_LOGO_Layer_1 = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Layer_1
		this.shape = new cjs.Shape();
		this.shape.graphics.f().s("#999999").ss(2, 1, 1).p("AHrEBQgIgHgGgEQgOgIgKgDIkahLQiKgmgvhXQgeg2ALhEQASg6AAgBQANgYALgMQASgTAWAAQASAAAYAOQALAGAZATIAEADIAkAeQANAKAQgBQAQgBALgLQAMgMAAgRQAAgSgMgMQgEgEgKgFIgpgUQgRgJgMgOQgMgPAAgNQAAgKAMgMQAOgOAagMIBqgyQAGgDADgDQAMgNAAgSQAAgRgMgMQgKgLgPgBQgPgBgNAIIgwAkQghAYgnAOQgoAOgkAAQhUAAgXhBIgiheQgDgJgHgHQgMgMgSAAQgRAAgMAMQgIAIgDAMQgDAKADAKQABACAFALIArBUIACAFQAnBQgDBJIAAAEQgEAngNAlQgIAXgIAPQgQAYgQAQQgzAyg+gDQgCAAi7gZIgFgBIgBAAQgYgBgPAPQgOAPAAAUQAAATAOAOQAOANATABQAXADB7ANQAnAEAUAPQAUAOANAhQAUA2g6BWIhPB2QgTAeAEAjQAEAkAaAaQAeAeArAAQArAAAegeQAbgbADglIAQirQADgeATgSQAYgYArAAQAzAABHAfIFECfIABAAQARAIATAAIABAAQARAAAOgGIABAAQAJgEAKgGIAGgFIACgCQAYgaAAgiQAAgjgZgag");
		this.shape.setTransform(-1.4986, -1.563, 1.9371, 1.9367);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f().s("#999999").ss(2, 1, 1).p("AAABCQgVAAgRgMQgRgNgHgVQgIgZAMgYQAMgYAbgKQAJgCAKAAQAWAAARAMQASANAGAVQAIAagMAXQgMAYgbAKQgMACgIAAg");
		this.shape_1.setTransform(-55.1132, -37.7789, 1.9371, 1.9368);

		this.timeline.addTween(cjs.Tween.get({}).to({ state: [{ t: this.shape_1 }, { t: this.shape }] }).wait(1));

	}).prototype = getMCSymbolPrototype(lib.VERTI_LOGO_Layer_1, null, null);


	(lib.Purple_ball_Layer_1 = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Layer_1
		this.shape = new cjs.Shape();
		this.shape.graphics.f("#8B1863").s().p("AhMBNQgggggBgtQABgsAgggQAgggAsgBQAtABAgAgQAgAgABAsQgBAtggAgQggAggtABQgsgBggggg");

		this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	}).prototype = getMCSymbolPrototype(lib.Purple_ball_Layer_1, null, null);


	(lib.VERTILOGO = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Layer_1_obj_
		this.Layer_1 = new lib.VERTI_LOGO_Layer_1();
		this.Layer_1.name = "Layer_1";
		this.Layer_1.parent = this;
		this.Layer_1.setTransform(-1.5, -1.6, 1, 1, 0, 0, 0, -1.5, -1.6);
		this.Layer_1.depth = 0;
		this.Layer_1.isAttachedToCamera = 0
		this.Layer_1.isAttachedToMask = 0
		this.Layer_1.layerDepth = 0
		this.Layer_1.layerIndex = 0
		this.Layer_1.maskLayerName = 0

		this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

	}).prototype = getMCSymbolPrototype(lib.VERTILOGO, new cjs.Rectangle(-102.5, -107, 202, 210.9), null);


	(lib.Purpleball = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Layer_1_obj_
		this.Layer_1 = new lib.Purple_ball_Layer_1();
		this.Layer_1.name = "Layer_1";
		this.Layer_1.parent = this;
		this.Layer_1.depth = 0;
		this.Layer_1.isAttachedToCamera = 0
		this.Layer_1.isAttachedToMask = 0
		this.Layer_1.layerDepth = 0
		this.Layer_1.layerIndex = 0
		this.Layer_1.maskLayerName = 0

		this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

	}).prototype = getMCSymbolPrototype(lib.Purpleball, new cjs.Rectangle(-10.9, -10.9, 21.9, 21.9), null);


	(lib.Neuron_Outline_base_outline = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// base_outline
		this.instance = new lib.VERTILOGO();
		this.instance.parent = this;
		this.instance.setTransform(102, 106, 0.9999, 0.9997);
		this.instance.alpha = 0.4883;

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	}).prototype = getMCSymbolPrototype(lib.Neuron_Outline_base_outline, null, null);


	(lib.Loader_Animation_Purple_ball = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Purple_ball
		this.instance = new lib.Purpleball();
		this.instance.parent = this;
		this.instance.setTransform(70.9, 42);

		this.timeline.addTween(cjs.Tween.get(this.instance).to({ scaleX: 0.9998, scaleY: 0.9998, rotation: 627.2358, guide: { path: [70.9, 42.1, 79.2, 44.3, 87.5, 46.5, 89.4, 47, 91.9, 48.5, 91.9, 48.5, 91.9, 48.6, 93.1, 49.3, 94.5, 50.5, 94.5, 50.5, 94.6, 50.5, 99, 55.2, 99.1, 61.5, 99.1, 61.5, 99.1, 61.6, 99.1, 67.8, 94.6, 72.4, 94.4, 72.6, 94.3, 72.8, 93.7, 73.2, 93.2, 73.6, 91.5, 74.8, 89.9, 75.5, 89.6, 75.5, 89.5, 75.6, 87, 76.7, 83.9, 76.7, 83.7, 76.7, 83.6, 76.7, 80.3, 76.7, 77.1, 75.2, 77, 75.1, 76.8, 75.1, 70.1, 71.8, 63.5, 68.6], orient: 'cw' } }, 5).to({ scaleX: 1, scaleY: 1, rotation: 720, guide: { path: [63.5, 68.6, 38.8, 56.6, 14.2, 44.5, 14.1, 44.5, 14.1, 44.5, 0.1, 38.4, -10.1, 38.4, -18.8, 38.4, -23.7, 43.3, -27.5, 47, -28.3, 53.1, -29.9, 69.7, -31.4, 86.2, -31.4, 86.3, -31.4, 86.3, -31.9, 93, -36.9, 97.9, -42.4, 103.5, -50.3, 103.5, -58.2, 103.5, -63.7, 97.9, -68.4, 93.3, -69.2, 86.7, -70, 80.3, -66.5, 74.6, -58.9, 63.2, -51.2, 51.7, -39.6, 34.7, -43.7, 23.9, -46.3, 17.2, -50.5, 14.3, -54.6, 11.4, -62.4, 10.6, -86.2, 8.1, -90.6, 7.5, -90.7, 7.5, -90.7, 7.5, -94.1, 7.2, -96.5, 5, -96.5, 5.1, -96.5, 5.1, -98.4, 3.1, -98.8, 0.5, -98.9, -0.2, -98.9, -0.9, -98.9, -4.4, -96.4, -6.9, -96.5, -6.9, -96.5, -6.9, -93.8, -9.6, -89.7, -9.3, -89.6, -9.3, -89.5, -9.3, -89.1, -9.2, -88.7, -9.1, -88.6, -9.1, -88.6, -9.1, -79.1, -7.9, -72.1, -6.9, -62.1, -5.6, -52, -4.3, -44.1, -3.4, -40.6, -11.3, -40.6, -11.3, -40.6, -11.3], orient: 'auto' } }, 22).to({ x: -44.05, y: -43.45 }, 3).to({ scaleX: 0.9996, scaleY: 0.9996, rotation: 717.2274, guide: { path: [-44, -43.3, -44.9, -44.5, -46.2, -45.4, -49.3, -47.6, -53.3, -47.6, -55.3, -47.6, -56.8, -47.1, -61.7, -45.4, -63.8, -41.2, -65.9, -37.2, -64.8, -32.7], orient: 'auto' } }, 2).to({ scaleX: 1, scaleY: 1, rotation: 720, guide: { path: [-64.8, -32.7, -64.7, -32.4, -64.6, -32, -64.6, -32, -64.6, -32.1, -63.4, -28.3, -60.4, -26.1, -59, -25.1, -56.5, -24.1, -56.5, -24.1, -56.5, -24.1, -53.9, -23.1, -52.3, -22.9, -52.2, -22.9, -52.2, -22.9, -49.3, -22.4, -46.4, -21.9], orient: 'auto' } }, 2).to({ x: -26.6, y: -22.6 }, 2).to({ guide: { path: [-26.6, -22.5, -21.1, -26.7, -19.1, -39.2], orient: 'auto' } }, 2).to({ regY: -0.1, scaleX: 0.9969, scaleY: 0.9969, rotation: 760.3404, guide: { path: [-19.1, -39.2, -18.7, -41.6, -18.4, -44.4, -18.4, -44.7, -18.4, -45.1, -17.8, -59, -25.3, -74.2, -25.4, -74.2, -25.4, -74.2, -25.5, -74.6, -25.7, -75.1, -29.8, -83.2, -34, -91.4, -34, -91.4, -34, -91.4, -35, -93.5, -35.2, -93.9, -35.2, -94, -35.2, -94.1, -35.9, -96.3, -35.2, -98.6, -34.6, -101.1, -32.8, -102.8, -30.2, -105.4, -26.4, -105.4, -22.6, -105.4, -20, -102.8, -18.5, -101.3, -17.8, -99.3, -17.8, -99.4, -17.8, -99.4, -14.5, -90.3, -11.2, -81.2, -11.2, -81.1, -11.2, -81.1, -6.9, -69.2, 8.6, -69.2, 15.5, -69.2, 23, -71.9, 30.4, -74.5, 36.7, -79.2, 41.4, -82.7, 46.1, -86.2, 46.1, -86.2, 46.2, -86.2, 48.4, -87.6, 51, -87.7], orient: 'auto' } }, 8).to({ regX: -0.1, scaleX: 0.996, scaleY: 0.996, rotation: 861.9065, guide: { path: [51, -87.7, 51.6, -87.8, 52.2, -87.7, 55.4, -87.4, 57.7, -85.1, 57.7, -85.1, 57.7, -85.1, 60.3, -82.5, 60.3, -78.7, 60.3, -74.8, 57.7, -72.1, 57.1, -71.4, 55.7, -70.7, 45.5, -65.8, 35.2, -61, 30.3, -58.7, 27.8, -56.2, 27.8, -56.2, 27.7, -56.2, 26.4, -54.9, 26, -53.7], orient: 'auto' } }, 4).to({ regX: 0, regY: 0, scaleX: 1, scaleY: 1, rotation: 720, guide: { path: [25.9, -53.6, 25.7, -53.1, 25.7, -52.6, 25.7, -52.6, 25.7, -52.5, 25.7, -50.3, 27.8, -47.8, 30, -45.1, 33.1, -43.6, 37, -41.7, 40.9, -39.7, 43.1, -38.7, 43.9, -37.7, 43.9, -37.8, 43.9, -37.8, 46.5, -35.1, 46.5, -31.3, 46.5, -27.5, 43.9, -24.9, 43.9, -24.9, 43.9, -24.8, 41.5, -22.5, 38.1, -22.2, 38.1, -22.2, 38, -22.2, 34.6, -22.1, 31.8, -24.3, 31.8, -24.3, 31.8, -24.3, 28.3, -27.2, 24.8, -30.1, 24.5, -30.3, 24.2, -30.5, 24.2, -30.6, 24.1, -30.6, 19.2, -34.2, 17.2, -35.5, 17.2, -35.5, 17.2, -35.4, 12.9, -38, 9.6, -38, 5.7, -38, 2.6, -34.5, 2.6, -34.5, 2.5, -34.5, 1.4, -33.4, -0.3, -30.6, -2, -28, -2.6, -26.4, -5.5, -19.1, -6, -15.4, -7.7, -4.1, -1.9, 6.3, 7.1, 22.8, 33.4, 30, 33.4, 30, 33.4, 30, 53.3, 35.3, 73.1, 40.6], orient: 'auto' } }, 11).wait(1));

	}).prototype = new cjs.MovieClip();


	(lib.LoaderAnimation = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// timeline functions:
		this.frame_61 = function () {
			this.___loopingOver___ = true;
		}

		// actions tween:
		this.timeline.addTween(cjs.Tween.get(this).wait(61).call(this.frame_61).wait(1));

		// Purple_ball_obj_
		this.Purple_ball = new lib.Loader_Animation_Purple_ball();
		this.Purple_ball.name = "Purple_ball";
		this.Purple_ball.parent = this;
		this.Purple_ball.setTransform(70.9, 42, 1, 1, 0, 0, 0, 70.9, 42);
		this.Purple_ball.depth = 0;
		this.Purple_ball.isAttachedToCamera = 0
		this.Purple_ball.isAttachedToMask = 0
		this.Purple_ball.layerDepth = 0
		this.Purple_ball.layerIndex = 0
		this.Purple_ball.maskLayerName = 0

		this.timeline.addTween(cjs.Tween.get(this.Purple_ball).wait(62));

	}).prototype = p = new cjs.MovieClip();
	p.nominalBounds = new cjs.Rectangle(-107.9, -112.9, 217.3, 227);


	(lib.Neuron_Outline_animation = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// animation
		this.instance = new lib.LoaderAnimation();
		this.instance.parent = this;
		this.instance.setTransform(100, 104.5);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	}).prototype = getMCSymbolPrototype(lib.Neuron_Outline_animation, null, null);


	(lib.NeuronOutline = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Outline_outlined (mask)
		var mask = new cjs.Shape();
		mask._off = true;
		mask.graphics.p("AqSPoQg3g2gIhKIAAgBQgJhLAohBIABgBICZjkQBpibgjhiIABAAQgVg5gkgZQgkgZhFgHQjtgZgtgGQgsgEgfgcIgBgBQgighABgvQgBguAigiQAkgkA0ADIADAAIADABIAKACIgBgBIFrAwIACAAQBwAFBbhbQAfgeAegsIgBABQAPgbAPgrQAXhGAIhIIAAgHQAGiKhKiVIAAgBIhXirIgMgZIgBgDQgIgZAIgaQAHgbAUgTQAcgdAqAAQAqAAAdAdQAQAQAIAXIAAgBIBCC2IAAABQAqBwCUAAQBEAABJgaIgBAAQBJgaA+guIBehFIACgBQAegTAiACQAlAEAYAZQAdAdAAAqQAAAqgcAeIgBAAQgHAIgOAIIjOBhQgxAWgXAYQgRARgBAMIAAABQAAATAUAWIAAABQATAYAdAPIBQAmQAXAMAJAKIABAAQAcAeAAApQAAAqgdAdQgaAagnADQgmABgegXIgBAAIhKg9IgDgCIhEgxIAAABQgpgYgegBQgkABgbAfIgBABQgWAVgWAqIgiBvQgUB8A4BiIAAABQBYChEEBIIgBAAIIhCRQAWAFAeASQAOAJAQAOIACABQA0A4ABBLQAABLg0A3IgBAAIgEAEIgBACIgLAJIgDABQgUAOgTAJIgFAAQgdAMgkAAIgCAAQgmAAgjgPQgEAAgDgCIpykzIgCgBQiDg6hhAAQhLAAgqAoQgeAggGAyIgfFLQgHBNg5A5QhABAhbAAQhbAAhAhAgAuKBBIABAAQAsAGDuAZQBRAJArAeQArAeAbBGQAsBwh3CwIiZDlQghA1AHA+QAIA+AsAsQA0A1BMAAQBLAAA0g1QAwgvAFg/IAAgBIAflLQAIhBAogoQA0g0BcAAQBmAACPA+IABAAIJxEzIAEABQAdANAgAAIACAAQAdAAAXgJIAGgCQAOgHAQgKIAKgIIADgDQApgsAAg6IAAgBQAAg8gpgrQgOgMgLgHQgYgPgRgDIgBAAIohiSQkWhMhdivQg/hvAYiLIAAgDIAihtQAAgEADgEQAagzAZgXIAAABQAogtAzABQAmgBA1AfIABAAQAUAMAyAmIAFADIAEADIBGA6IgCgBQAUAPAYgBIABAAQAXgCAQgPQASgRAAgbQAAgagSgSQgHgGgQgIIhPgmQglgTgZgfQgegkACgfIAAgBQgBgZAegeQAcgcA4gaIDNhhIgBAAQAJgEADgEQASgSAAgbQAAgagSgSQgPgPgWgCQgWgBgSALIgBAAIhdBFQhCAyhOAcQhRAchJAAQi0AAgviLIhCi2QgEgNgKgLQgSgRgaAAQgaAAgRARQgMAMgEARIgBABQgEANADAMIAAABIABADIAAgDIAKAZIAAgBIBUCjIABACIADAIQBNCfgFCSIAAAIIAAACQgIBMgaBLQgQAvgQAdIgCABQggAwggAgQhoBoiBgGIgBAAIlugwIgDAAIgIgCIgBAAQgkgCgYAXIABAAQgXAWAAAfQAAAfAWAWIAAgBQAVAUAfACgApujwIgBgBQgmgcgPgvQgRg8Aag1QAZg0A/gVQASgHAaAAQAxAAAmAcQAnAcAOAuIAAABQASA9gcA1IAAgBQgZA0g8AVIgDABQgaAGgQAAQgwAAgngbgApYkQQAdAUAkAAQAMAAAVgEQAsgRATgmIABAAQAUgngOgtQgKgigcgUIgBgBQgcgUgkAAQgSAAgOAEQguAQgTAnQgUAnANAuIAAgBQALAiAcAVg");
		mask.setTransform(100.5, 104.425);

		// animation_obj_
		this.animation = new lib.Neuron_Outline_animation();
		this.animation.name = "animation";
		this.animation.parent = this;
		this.animation.setTransform(140.9, 130.9, 1, 1, 0, 0, 0, 140.9, 130.9);
		this.animation.depth = 0;
		this.animation.isAttachedToCamera = 0
		this.animation.isAttachedToMask = 0
		this.animation.layerDepth = 0
		this.animation.layerIndex = 0
		this.animation.maskLayerName = 0

		var maskedShapeInstanceList = [this.animation];

		for (var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
			maskedShapeInstanceList[shapedInstanceItr].mask = mask;
		}

		this.timeline.addTween(cjs.Tween.get(this.animation).wait(1));

		// base_outline_obj_
		this.base_outline = new lib.Neuron_Outline_base_outline();
		this.base_outline.name = "base_outline";
		this.base_outline.parent = this;
		this.base_outline.setTransform(100.5, 104.4, 1, 1, 0, 0, 0, 100.5, 104.4);
		this.base_outline.depth = 0;
		this.base_outline.isAttachedToCamera = 0
		this.base_outline.isAttachedToMask = 0
		this.base_outline.layerDepth = 0
		this.base_outline.layerIndex = 1
		this.base_outline.maskLayerName = 0

		this.timeline.addTween(cjs.Tween.get(this.base_outline).wait(1));

	}).prototype = getMCSymbolPrototype(lib.NeuronOutline, new cjs.Rectangle(-0.5, -1, 202, 210.9), null);


	(lib.Scene_1_Layer_1 = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		// Layer_1
		this.instance = new lib.NeuronOutline();
		this.instance.parent = this;
		this.instance.setTransform(318.45, 240.3, 1.765, 1.7648, 0, 0, 0, 99.7, 104.4);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	}).prototype = getMCSymbolPrototype(lib.Scene_1_Layer_1, null, null);


	// stage content:
	(lib.VertiSpinner_HTML5 = function (mode, startPosition, loop) {
		this.initialize(mode, startPosition, loop, {});

		this.___GetDepth___ = function (obj) {
			var depth = obj.depth;
			var cameraObj = this.___camera___instance;
			if (cameraObj && cameraObj.depth && obj.isAttachedToCamera) {
				depth += depth + cameraObj.depth;
			}
			return depth;
		}
		this.___needSorting___ = function () {
			for (var i = 0; i < this.getNumChildren() - 1; i++) {
				var prevDepth = this.___GetDepth___(this.getChildAt(i));
				var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
				if (prevDepth < nextDepth)
					return true;
			}
			return false;
		}
		this.___sortFunction___ = function (obj1, obj2) {
			return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
		}
		this.on('tick', function (event) {
			var curTimeline = event.currentTarget;
			if (curTimeline.___needSorting___()) {
				this.sortChildren(curTimeline.___sortFunction___);
			}
		});

		// Layer_1_obj_
		this.Layer_1 = new lib.Scene_1_Layer_1();
		this.Layer_1.name = "Layer_1";
		this.Layer_1.parent = this;
		this.Layer_1.setTransform(319.9, 240.3, 1, 1, 0, 0, 0, 319.9, 240.3);
		this.Layer_1.depth = 0;
		this.Layer_1.isAttachedToCamera = 0
		this.Layer_1.isAttachedToMask = 0
		this.Layer_1.layerDepth = 0
		this.Layer_1.layerIndex = 0
		this.Layer_1.maskLayerName = 0

		this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

	}).prototype = p = new cjs.MovieClip();
	p.nominalBounds = new cjs.Rectangle(460, 292.5, 39.80000000000001, 135.7);
	// library properties:
	lib.properties = {
		id: '77293A3308CC43AB8A2C29199F97E7BE',
		width: 640,
		height: 480,
		fps: 24,
		color: "#FFFFFF",
		opacity: 1.00,
		manifest: [],
		preloads: []
	};



	// bootstrap callback support:

	(lib.Stage = function (canvas) {
		createjs.Stage.call(this, canvas);
	}).prototype = p = new createjs.Stage();

	p.setAutoPlay = function (autoPlay) {
		this.tickEnabled = autoPlay;
	}
	p.play = function () { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
	p.stop = function (ms) { if (ms) this.seek(ms); this.tickEnabled = false; }
	p.seek = function (ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
	p.getDuration = function () { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

	p.getTimelinePosition = function () { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

	an.bootcompsLoaded = an.bootcompsLoaded || [];
	if (!an.bootstrapListeners) {
		an.bootstrapListeners = [];
	}

	an.bootstrapCallback = function (fnCallback) {
		an.bootstrapListeners.push(fnCallback);
		if (an.bootcompsLoaded.length > 0) {
			for (var i = 0; i < an.bootcompsLoaded.length; ++i) {
				fnCallback(an.bootcompsLoaded[i]);
			}
		}
	};

	an.compositions = an.compositions || {};
	an.compositions['77293A3308CC43AB8A2C29199F97E7BE'] = {
		getStage: function () { return exportRoot.getStage(); },
		getLibrary: function () { return lib; },
		getSpriteSheet: function () { return ss; },
		getImages: function () { return img; }
	};

	an.compositionLoaded = function (id) {
		an.bootcompsLoaded.push(id);
		for (var j = 0; j < an.bootstrapListeners.length; j++) {
			an.bootstrapListeners[j](id);
		}
	}

	an.getComposition = function (id) {
		return an.compositions[id];
	}


	// Layer depth API : 

	AdobeAn.Layer = new function () {
		this.getLayerZDepth = function (timeline, layerName) {
			if (layerName === "Camera") {
				layerName = "___camera___instance";
			}
			if (timeline[layerName]) {
				return timeline[layerName].depth;
			} else {
				return 0;
			}
		}
		this.setLayerZDepth = function (timeline, layerName, zDepth) {
			const MAX_zDepth = 10000;
			const MIN_zDepth = -5000;
			if (zDepth > MAX_zDepth)
				zDepth = MAX_zDepth;
			else if (zDepth < MIN_zDepth)
				zDepth = MIN_zDepth;
			if (layerName === "Camera") {
				layerName = "___camera___instance";
			}
			if (timeline[layerName]) {
				timeline[layerName].depth = zDepth;
			}
		}
		this.removeLayer = function (timeline, layerName) {
			if (layerName === "Camera") {
				layerName = "___camera___instance";
			}
			if (timeline[layerName]) {
				timeline.removeChild(timeline[layerName]);
			}
		}
		this.addNewLayer = function (timeline, layerName, zDepth) {
			if (layerName === "Camera") {
				layerName = "___camera___instance";
			}
			zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
			var layer = new createjs.MovieClip();
			layer.name = layerName;
			layer.depth = zDepth;
			layer.layerIndex = 0;
			timeline.addChild(layer);
		}
	}


})(createjs = createjs || {}, AdobeAn = AdobeAn || {});
var createjs, AdobeAn;