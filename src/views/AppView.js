define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Timer = require('famous/utilities/Timer');
   var Surface = require('famous/core/Surface');
   var Modifier = require('famous/core/Modifier');
   var Transform = require('famous/core/Transform');
   var InitialView = require('views/InitialView');
   var LeftTrianglesMoveView = require('views/LeftTrianglesMoveView');
   var RightTrianglesMoveView = require('views/RightTrianglesMoveView');
   var ScoreView = require('views/ScoreView');

   // collision detection objects
   var V = SAT.Vector;
   var P = SAT.Polygon;
   var B = SAT.Box;

   var isAndroid = navigator.userAgent.match(/Android/i) ? true : false;

   function AppView() {
      View.apply(this, arguments);

      this.x = 0;
      this.y = 0;
      this.yDeltaPow = 0;
      this.yDelta = 0;
      this.dx = 2.2;
      this.box = null;
      this.initialStart = true;
      this.stopBouncy = false;
      this.runBouncy = false;
      this.points = 0;
      this.upTriangles = [];
      this.downTriangles = [];
      this.leftTriangles = [];
      this.rightTriangles = [];
      this.usedLeftTriangles = [];
      this.usedRightTriangles = [];
      this.collidedTriangles = [];
      this.isCollided = false;
      this.increaseY1 = 0;
      this.increaseY2 = 40;
      this.increaseY3 = 20;
      this.increaseX1 = 0;
      this.increaseX2 = 20;
      this.increaseX3 = 40;
      this.raiseBouncy = false;

      // only load the sounds if the user agent isn't android
      if (!isAndroid) {
         this.clickSound = null;
         this.clickSound = document.createElement("audio");
         this.clickSound.src = "sounds/3.ogg";

         this.bounceSound = null;
         this.bounceSound = document.createElement("audio");
         this.bounceSound.src = "sounds/2.ogg";

         this.crashSound = null;
         this.crashSound = document.createElement("audio");
         this.crashSound.src = "sounds/1.ogg";
      }

      _createInitialView.call(this);
      _createScoreView.call(this);
      _createLeftTrianglesMoveView.call(this);
      _createRightTrianglesMoveView.call(this);
      _createBouncy.call(this);
      _moveInitialTriangles.call(this);

      _setListeners.call(this);
   }

   AppView.prototype = Object.create(View.prototype);
   AppView.prototype.constructor = AppView;

   AppView.DEFAULT_OPTIONS = {
      bouncySize: 12
   };

   function _createInitialView() {
      this.initialView = new InitialView();

      this.add(this.initialView);
   }

   function _createLeftTrianglesMoveView() {
      this.leftTrianglesMoveView = new LeftTrianglesMoveView();

      this.add(this.leftTrianglesMoveView);
   }

   function _createRightTrianglesMoveView() {
      this.rightTrianglesMoveView = new RightTrianglesMoveView();

      this.add(this.rightTrianglesMoveView);
   }

   function _createScoreView() {
      this.scoreView = new ScoreView();

      this.add(this.scoreView);
   }

   function _moveInitialTriangles() {
      Timer.setTimeout(function() {
         this.initialView.backupLeftRightTriangles();
      }.bind(this), 600);
   }

   function _setListeners() {
      this.initialView.on('makeBounce', function() {
         if (this.initialStart) {
            Timer.setTimeout(function() {
               this.initialStart = false;
               this.runBouncy = true;
               this.rightTrianglesMoveView.moveRightTriangles(this.points);
               this.scoreView.trigger('gameStarted');

               if (!isAndroid) {
                  this.clickSound.play();
               }
            }.bind(this), 600);
         }

         if (this.runBouncy && !isAndroid) {
            this.clickSound.currentTime = 0;
            this.clickSound.play();
         }

         this.raiseBouncy = true;
         this.yDelta = 0;
      }.bind(this));

      this.scoreView.on('gameStart', function() {
         
         this.initialView.trigger('gameStartTitles');
         this.initialView.trigger('swapBackgrounds');
         _moveInitialTriangles.call(this);
         this.stopBouncy = false;
         this.initialStart = true;
         this.x = 0;
         this.y = 0;
         this.dx = 2.2;
      }.bind(this));
   }

   function _createBouncy() {

      var _this = this;

      var bouncy = new Surface({
         size: [this.options.bouncySize, this.options.bouncySize],
         properties: {
            backgroundColor: '#222222'
         }
      });

      // create uptriangles
      for (var u = 0; u < 7; u++) {
         this.upTriangles.push(new P(new V(0, 0), [new V(this.increaseX1, 0), new V(this.increaseX2, 20), new V(this.increaseX3, 0)]));
         this.increaseX1 += 40;
         this.increaseX2 += 40;
         this.increaseX3 += 40;
      }

      this.increaseX1 = 0;
      this.increaseX2 = 40;
      this.increaseX3 = 20;

      // create downtriangles
      for (var d = 0; d < 7; d++) {
         this.downTriangles.push(new P(new V(0, 0), [new V(this.increaseX1, 0), new V(this.increaseX2, 0), new V(this.increaseX3, -20)]));
         this.increaseX1 += 40;
         this.increaseX2 += 40;
         this.increaseX3 += 40;
      }

      // create lefttriangles
      for (var l = 0; l < 12; l++) {
         this.leftTriangles.push(new P(new V(0, 0), [new V(0, this.increaseY1), new V(0, this.increaseY2), new V(20, this.increaseY3)]));
         this.increaseY1 += 40;
         this.increaseY2 += 40;
         this.increaseY3 += 40;
      }

      this.increaseY1 = 0;
      this.increaseY2 = 20;
      this.increaseY3 = 40;

      // create righttriangles
      for (var r = 0; r < 12; r++) {
         this.rightTriangles.push(new P(new V(0, 0), [new V(0, this.increaseY1), new V(-20, this.increaseY2), new V(0, this.increaseY3)]));
         this.increaseY1 += 40;
         this.increaseY2 += 40;
         this.increaseY3 += 40;
      }

      this.bouncySquareModifier = new Modifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: function() {
            
            // if the game is not yet started, position bouncy in the middle
            if (_this.initialStart) {
               _this.rightTrianglesMoveView.on('orderOfTriangles', function(data) {
                  _this.usedRightTriangles = data;
               });

               return Transform.translate(0, 0, 0);
            } else if (_this.runBouncy) { // if the game has started, move bouncy around

               // check if bouncy has reached the right wall
               if (_this.x > 138) {
                  _this.dx = -_this.dx;
                  _this.points++;
                  _this.scoreView.trigger('increaseCounter', _this.points);
                  _this.leftTrianglesMoveView.moveLeftTriangles(_this.points);
                  _this.rightTrianglesMoveView.backupRightTriangles();

                  if (!isAndroid) {
                     _this.bounceSound.play();
                  }
               } else if (_this.x < -138) { // check if bouncy has reached the right wall
                  _this.dx = -_this.dx;
                  _this.points++;
                  _this.scoreView.trigger('increaseCounter', _this.points);
                  _this.leftTrianglesMoveView.backupLeftTriangles();
                  _this.rightTrianglesMoveView.moveRightTriangles(_this.points);

                  if (!isAndroid) {
                     _this.bounceSound.play();
                  }
               }

               // // raise bouncy up on every click
               if (_this.raiseBouncy) {
                  _this.yDelta += 0.15;
                  _this.y += -4;
                  _this.yDeltaPow = 0.25*(Math.pow(_this.yDelta, 2));
                  _this.y += _this.yDeltaPow;
               }

               _this.x += _this.dx;

               // check if bouncy has crashed into one of the uptriangles
               if (_this.y < -220) {
                  _this.box = new B(new V(_this.x + 132, _this.y + 246), 10, 10).toPolygon();

                  for (u = 0; u < _this.upTriangles.length; u++) {
                     _this.isCollided = SAT.testPolygonPolygon(_this.upTriangles[u], _this.box);

                     _this.collidedTriangles.push(_this.isCollided);
                  }

                  if (_this.collidedTriangles.indexOf(true) >= 0) {
                     if (!isAndroid) {
                        _this.crashSound.play();
                     }

                     _this.initialView.revealLeftRightTriangles();
                     _this.scoreView.trigger('gameOver', _this.points);
                     _this.initialView.trigger('gameOver');
                     _this.runBouncy = false;
                     _this.stopBouncy = true;
                     _this.rightTrianglesMoveView.backupRightTriangles();
                     _this.leftTrianglesMoveView.backupLeftTriangles();
                     _this.scoreView.trigger('resetCounter');
                     _this.points = 0;
                  }

                  _this.collidedTriangles = [];
               } else if (_this.y > 220) { // / check if bouncy has crashed into one of the downtriangles
                  _this.box = new B(new V(_this.x + 132, _this.y - 256), 10, 10).toPolygon();

                  for (d = 0; d < _this.downTriangles.length; d++) {
                     _this.isCollided = SAT.testPolygonPolygon(_this.downTriangles[d], _this.box);

                     _this.collidedTriangles.push(_this.isCollided);
                  }

                  if (_this.collidedTriangles.indexOf(true) >= 0) {
                     if (!isAndroid) {
                        _this.crashSound.play();
                     }

                     _this.initialView.revealLeftRightTriangles();
                     _this.scoreView.trigger('gameOver', _this.points);
                     _this.initialView.trigger('gameOver');
                     _this.runBouncy = false;
                     _this.stopBouncy = true;
                     _this.rightTrianglesMoveView.backupRightTriangles();
                     _this.leftTrianglesMoveView.backupLeftTriangles();
                     _this.scoreView.trigger('resetCounter');
                     _this.points = 0;
                  }

                  _this.collidedTriangles = [];
               }

               // / check if bouncy has crashed into one of the lefttriangles
               if (_this.x < -120) {
                  _this.rightTrianglesMoveView.on('orderOfTriangles', function(data) {
                     _this.usedRightTriangles = data;
                  });

                  _this.box = new B(new V(_this.x + 139, _this.y + 235), 10, 10).toPolygon();

                  for (l = 0; l < _this.usedLeftTriangles.length; l++) {
                     _this.isCollided = SAT.testPolygonPolygon(_this.leftTriangles[_this.usedLeftTriangles[l]], _this.box);

                     _this.collidedTriangles.push(_this.isCollided);
                  }

                  if (_this.collidedTriangles.indexOf(true) >= 0) {
                     if (!isAndroid) {
                        _this.crashSound.play();
                     }

                     _this.initialView.revealLeftRightTriangles();
                     _this.scoreView.trigger('gameOver', _this.points);
                     _this.initialView.trigger('gameOver');
                     _this.runBouncy = false;
                     _this.stopBouncy = true;
                     _this.rightTrianglesMoveView.backupRightTriangles();
                     _this.leftTrianglesMoveView.backupLeftTriangles();
                     _this.scoreView.trigger('resetCounter');
                     _this.points = 0;
                  }

                  _this.collidedTriangles = [];
               } else if (_this.x > 120) { // / check if bouncy has crashed into one of the righttriangles
                   _this.leftTrianglesMoveView.on('orderOfTriangles', function(data) {
                     _this.usedLeftTriangles = data;
                  });
                  
                  _this.box = new B(new V(_this.x - 149, _this.y + 235), 10, 10).toPolygon();

                  for (r = 0; r < _this.usedRightTriangles.length; r++) {
                     _this.isCollided = SAT.testPolygonPolygon(_this.rightTriangles[_this.usedRightTriangles[r]], _this.box);

                     _this.collidedTriangles.push(_this.isCollided);
                  }

                  if (_this.collidedTriangles.indexOf(true) >= 0) {
                     if (!isAndroid) {
                        _this.crashSound.play();
                     }

                     _this.initialView.revealLeftRightTriangles();
                     _this.scoreView.trigger('gameOver', _this.points);
                     _this.initialView.trigger('gameOver');
                     _this.runBouncy = false;
                     _this.stopBouncy = true;
                     _this.rightTrianglesMoveView.backupRightTriangles();
                     _this.leftTrianglesMoveView.backupLeftTriangles();
                     _this.scoreView.trigger('resetCounter');
                     _this.points = 0;
                  }

                  _this.collidedTriangles = [];
               }

               return Transform.translate(_this.x, _this.y, 0);
            } else if (_this.stopBouncy) {
               return Transform.translate(_this.x, _this.y, 0);
            }
         }
      });

      this.add(this.bouncySquareModifier).add(bouncy);
   }

   module.exports = AppView;

});