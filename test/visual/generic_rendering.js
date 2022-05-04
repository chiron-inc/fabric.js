(function() {
  var getFixture;
  if (fabric.isLikelyNode) {
    if (process.env.launcher === 'Firefox') {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (process.env.launcher === 'Node') {
      fabric.browserShadowBlurConstant = 1;
    }
    if (process.env.launcher === 'Chrome') {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (process.env.launcher === 'Edge') {
      fabric.browserShadowBlurConstant = 1.75;
    }
    getFixture = global.getFixture;
  }
  else {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (navigator.userAgent.indexOf('Edge') !== -1) {
      fabric.browserShadowBlurConstant = 1.75;
    }
    getFixture = window.getFixture;
  }
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = true;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }

  var tests = [];

  function generic1(canvas, callback) {
    var rect = new fabric.Rect({
      width: 20, height: 40, strokeWidth: 2, scaleX: 6, scaleY: 0.5, strokeUniform: true,
      fill: '', stroke: 'red'
    });
    var rect2 = new fabric.Rect({
      width: 60, height: 60, top: 4, left: 4, strokeWidth: 2, scaleX: 2,
      scaleY: 0.5, strokeUniform: false, fill: '', stroke: 'blue',
    });
    canvas.add(rect);
    canvas.add(rect2);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with strokeUniform: true',
    code: generic1,
    golden: 'generic1.png',
    newModule: 'Generic rendering',
    percentage: 0.09,
    width: 150,
    height: 60,
  });

  function renderStrokeWithNegativeScale(canvas, callback) {
    var rect = new fabric.Rect({
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 15,
      strokeUniform: true,
      strokeDashArray: [2, 2],
      top: 65,
      left: 30,
    });
    // do not do this at init time or they will be positive
    rect.scaleX = -2;
    rect.scaleY = -4;

    var rect2 = new fabric.Rect({
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 15,
      scaleX: -2,
      scaleY: -4,
      strokeDashArray: [2, 2],
      strokeUniform: true,
      top: 10,
      left: 55,
    });
    canvas.add(rect, rect2);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with strokeUniform: true and negative scaling',
    code: renderStrokeWithNegativeScale,
    golden: 'strokeNegativeScale.png',
    percentage: 0.011,
    disabled: fabric.isLikelyNode,
    width: 100,
    height: 100,
  });

  function shadownonscaling(canvas, callback) {
    var obj = new fabric.Rect();
    obj.set({
      width: 10, height: 10, scaleX: 12, scaleY: 3, top: 10, left: 5, fill: '#f55',
    });
    obj.set('shadow', new fabric.Shadow({
      color: 'rgba(0,100,0,0.9)', blur: 5, offsetX: 8, offsetY: 8, nonScaling: true
    }));
    canvas.add(obj);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect DropShadow with nonScaling: true',
    code: shadownonscaling,
    golden: 'shadownonscaling.png',
    percentage: 0.09,
    width: 150,
    height: 60,
  });

  function polygonWithStroke(canvas, callback) {
    canvas.set({backgroundColor: '#AAAA77'});
    var p1 = new fabric.Polygon([
      {x: 0, y: 216},
      {x: 125, y: 433},
      {x: 375, y: 433},
      {x: 500, y: 216},
      {x: 375, y: 0},
      {x: 125, y: 0}
    ],
    {
      fill: 'white'
    });
    canvas.add(p1);
    var p2 = new fabric.Polygon([
      {x: 0, y: 216},
      {x: 125, y: 433},
      {x: 375, y: 433},
      {x: 500, y: 216},
      {x: 375, y: 0},
      {x: 125, y: 0}
    ],
    {
      fill: 'transparent',
      stroke: '#00AAFFAA',
      strokeWidth: 15,
      originX: 'center',
      originY: 'center'
    });
    canvas.add(p2);
    canvas.setZoom(0.4);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'polygon position independently from strokeWidth and origin',
    code: polygonWithStroke,
    golden: 'polygonWithStroke.png',
    percentage: 0.09,
    width: 210,
    height: 210,
  });

  function backgroundWithGradient(canvas, callback) {
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4 , -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }]
    });
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'canvas can have a gradient background',
    code: backgroundWithGradient,
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function backgroundWithGradientZoom(canvas, callback) {
    canvas.setZoom(0.1);
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4 , -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 300,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }]
    });
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'canvas can have a gradient background and being zoomed',
    code: backgroundWithGradientZoom,
    golden: 'backgroundWithGradientZoom.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function backgroundWithGradientNoVpt(canvas, callback) {
    canvas.setZoom(0.1);
    canvas.backgroundVpt = false;
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4 , -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }]
    });
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'canvas can have a gradient background with zoom but being unaffected',
    code: backgroundWithGradientNoVpt,
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function fillParent(canvas, callback) {
    var points = [
      { x: 0, y: 216 },
      { x: 125, y: 433 },
      { x: 375, y: 433 },
      { x: 500, y: 216 },
      { x: 375, y: 0 },
      { x: 125, y: 0 }
    ];
    var canvasBg = new fabric.Rect({
      layout: 'fill-parent',
      fill: 'lightblue'
    });
    var groupBg = new fabric.Rect({
      layout: 'fill-parent',
      fill: 'blue',
      //  noise values
      left: 300,
      top: 500
    });
    var group = new fabric.Group([groupBg], {
      layout: 'fixed',
      width: 50,
      height: 30,
      left: 120,
      top: 120
    });
    var rect1 = new fabric.Rect({
      fill: 'magenta',
      left: 50,
      top: 60,
      width: 50,
      height: 50
    });
    var circle = new fabric.Circle({
      layout: 'fill-parent',
      fill: 'yellow',
      //  noise values
      left: 300,
      top: 500
    });
    var group1 = new fabric.Group([rect1, circle]);
    var rect2 = new fabric.Rect({
      fill: 'magenta',
      left: 30,
      top: 160,
      width: 200,
      height: 40
    });
    var ellipse = new fabric.Ellipse({
      layout: 'fill-parent',
      stroke: 'cyan',
      strokeWidth: 5,
      fill: '',
      //  noise values
      left: 300,
      top: 500
    });
    var group2 = new fabric.Group([rect2, ellipse]);
    var polygon = new fabric.Polygon(points, {
      layout: 'fill-parent',
      fill: 'cyan'
    });
    var groupBg3 = new fabric.Rect({
      layout: 'fill-parent',
      fill: 'blue',
      //  noise values
      left: 300,
      top: 500
    });
    var group3 = new fabric.Group([groupBg3, polygon], {
      layout: 'fixed',
      width: 50,
      height: 50,
      left: 120,
      top: 0
    });
    var polygon1 = new fabric.Polygon(points, {
      layout: 'fill-parent',
      fill: '',
      stroke: 'magenta',
      strokeWidth: 5,
      strokeUniform: true,
      exactBoundingBox: true
    });
    var polygon2 = new fabric.Polygon(points, {
      layout: 'fill-parent',
      fill: '',
      stroke: 'red',
      strokeWidth: 5,
      exactBoundingBox: true
    });
    var groupBg4 = new fabric.Rect({
      layout: 'fill-parent',
      fill: 'blue',
      //  noise values
      left: 300,
      top: 500
    });
    var group4 = new fabric.Group([groupBg4, polygon1, polygon2], {
      layout: 'fixed',
      width: 50,
      height: 50,
      left: 120,
      top: 60
    });

    var polygonX = new fabric.Polygon([
      { x: 0, y: 216 },
      { x: 125, y: 433 },
      { x: 375, y: 433 },
      { x: 500, y: 216 },
      { x: 375, y: 0 },
      { x: 125, y: 0 }
    ], {
      layout: 'fill-parent',
      fill: '',
      stroke: 'red',
      strokeWidth: 10,
     // strokeUniform: true,
      exactBoundingBox: true
    });

    canvas.add(canvasBg, group, group1, group2, group3, group4, polygonX);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'fill-parent layout',
    code: fillParent,
    golden: 'fill-parent.png',
    percentage: 0.005,
    width: 250,
    height: 200,
  });

  function objectsInActiveSelections(canvas, callback) {
    canvas.setZoom(0.1);
    var rect1 = new fabric.Rect({ fill: 'purple', top: 30, left: 50, width: 30, height: 100, angle: 10 });
    var rect2 = new fabric.Rect({ fill: 'green', top: 150, left: 10, width: 300, height: 30, angle: -10 });
    new fabric.ActiveSelection([rect1, rect2]);
    var output = rect1.toCanvasElement();
    callback(output);
  }

  tests.push({
    test: 'objects in activeSelection toCanvasElement',
    code: objectsInActiveSelections,
    golden: 'objectsInActiveSelections.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function canvasPattern(fabricCanvas, callback) {
    getFixture('diet.jpeg', false, function(img) {
      var pattern = new fabric.Pattern({
        source: img,
        repeat: 'repeat',
        offsetX: -120,
        offsetY: 50
      });
      fabricCanvas.backgroundColor = pattern;
      var canvas = fabricCanvas.toCanvasElement();
      callback(canvas);
    });
  }

  tests.push({
    test: 'canvas with background pattern and export',
    code: canvasPattern,
    // use the same golden on purpose
    golden: 'canvasPattern.png',
    percentage: 0.09,
    width: 500,
    height: 500,
  });

  function canvasPatternMultiplier(fabricCanvas, callback) {
    getFixture('diet.jpeg', false, function(img2) {
      var pattern = new fabric.Pattern({
        source: img2,
        repeat: 'repeat',
        offsetX: -120,
        offsetY: 50
      });
      fabricCanvas.backgroundColor = pattern;
      var canvas = fabricCanvas.toCanvasElement(0.3);
      callback(canvas);
    });
  }

  tests.push({
    test: 'canvas with background pattern and multiplier',
    code: canvasPatternMultiplier,
    // use the same golden on purpose
    golden: 'canvasPatternMultiplier.png',
    percentage: 0.09,
    width: 500,
    height: 500,
  });

  function imageSmoothing(fabricCanvas, callback) {
    getFixture('greyfloral.png', false, function(img2) {
      var fImg = new fabric.Image(img2, { imageSmoothing: false, scaleX: 10, scaleY: 10 });
      var fImg2 = new fabric.Image(img2, { left: 400, scaleX: 10, scaleY: 10 });
      fabricCanvas.add(fImg);
      fabricCanvas.add(fImg2);
      fabricCanvas.renderAll();
      callback(fabricCanvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'fabric.Image with imageSmoothing false',
    code: imageSmoothing,
    // use the same golden on purpose
    golden: 'imageSoothingOnObject.png',
    percentage: 0.09,
    width: 800,
    height: 400,
  });

  function pathWithGradient(canvas, callback) {
    var pathWithGradient = new fabric.Path('M 0 0 L 0 100 L 100 100 L 100 0 Z', {
      fill: new fabric.Gradient({
        gradientUnits: 'percentage',
        coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'black' }
        ]
      }),
      height: 100,
      width: 100,
      top: 0,
      left: 0
    });
    canvas.add(pathWithGradient);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'gradient should be applied to path',
    code: pathWithGradient,
    golden: 'pathWithGradient.png',
    percentage: 0.06,
    width: 100,
    height: 100,
  });

  function gradientStroke(canvas, callback) {
    var line = new fabric.Line([10, 10, 200, 200], {
      stroke: new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 20,
          y1: 0,
          x2: 80,
          y2: 0,
        },
        colorStops: [
          {
            offset: 0,
            color: 'green',
          },
          {
            offset: 0.4,
            color: 'cyan',
          },
          {
            offset: 1,
            color: 'red',
          },
        ],
        gradientTransform: [1, 0, 0, 1, 50, 0]
      }),
      strokeWidth: 20,
    });
    canvas.add(
      line
    );
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);

  }

  tests.push({
    test: 'Use the gradient strokeStyle for line(other shape is ok)',
    code: gradientStroke,
    golden: 'gradientStroke.png',
    newModule: 'Gradient stroke',
    percentage: 0.02,
    width: 300,
    height: 300,
  });

  function textGradientFill(canvas, callback) {
    var text = new fabric.Text('Some Text', {
      fontSize: 40,
      left: 25,
      top: -25,
      fontWeight: 'bold',
      fill: new fabric.Gradient({
        type: 'radial',
        coords: {
          x1: 0,
          y1: 0,
          r1: 100,
          x2: 0,
          y2: 0,
          r2: 50
        },
        colorStops: [
          {
            offset: 0,
            color: 'white',
          },
          {
            offset: 0.5,
            color: 'indianred',
          },
          {
            offset: 1,
            color: 'green',
          },
        ],
        gradientTransform: [1, 0, 0, 1, 50, 50]
      })
    });
    canvas.add(
      text
    );
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);

  }

  tests.push({
    test: 'Use the gradient fillStyle for text',
    code: textGradientFill,
    golden: 'textGradientFill.png',
    newModule: 'Text gradient fill',
    percentage: 0.04,
    width: 300,
    height: 100,
  });

  tests.forEach(visualTestLoop(QUnit));
})();
