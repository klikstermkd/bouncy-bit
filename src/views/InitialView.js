define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Surface = require('famous/core/Surface');
   var Transform = require('famous/core/Transform');
   var LeftTrianglesView = require('views/LeftTrianglesView');
   var RightTrianglesView = require('views/RightTrianglesView');
   var StateModifier = require('famous/modifiers/StateModifier');
   var Timer = require('famous/utilities/Timer');
   var MouseSync = require('famous/inputs/MouseSync');
   var TouchSync = require('famous/inputs/TouchSync');
   var GenericSync = require('famous/inputs/GenericSync');

   GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

   function InitialView() {
      View.apply(this, arguments);

      this.syncBackground = new GenericSync({'mouse': {}, 'touch': {}});
      this.syncPlayText = new GenericSync({'mouse': {}, 'touch': {}});

      this.trianglesTransition = {curve: 'easeOut', duration: 400};

      _createBackgrounds.call(this);
      _createTitles.call(this);
      _createTriangles.call(this);
      _createLeftTrianglesView.call(this);
      _createRightTrianglesView.call(this);
   }

   InitialView.prototype = Object.create(View.prototype);
   InitialView.prototype.constructor = InitialView;

   InitialView.DEFAULT_OPTIONS = {
      gameWidth: 286,
      gameBackground: '#00ebb0',
      gamePartsColor: '#191919',
      bouncySize: 13
   };

   function _createBackgrounds() {
      var mainBackground = new Surface({
         size: [undefined, undefined],
         properties: {
            backgroundColor: this.options.gamePartsColor
         }
      });

      this.add(mainBackground);

      this.gameContainer = new Surface({
         size: [this.options.gameWidth, 500],
         properties: {
            backgroundColor: this.options.gameBackground
         }
      });

      this.gameContainerModifier = new StateModifier({
         origin: [0.5, 0.5],
         align: [0.5, 0.5],
         opacity: 1
      });

      this.gameContainer.pipe(this.syncBackground);

      // when the background is clicked, emit event to bounce
      this.syncBackground.on('start', function() {
         this._eventOutput.emit('makeBounce');
         this.gameTitleModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.playTextModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
      }.bind(this));

      this.gameContainerGameOver = new Surface({
         size: [this.options.gameWidth, 500],
         properties: {
            backgroundColor: '#F50C19',
            pointerEvents: 'none'
         }
      });

      this.gameContainerGameOverModifier = new StateModifier({
         origin: [0.5, 0.5],
         align: [0.5, 0.5],
         opacity: 0
      });

      this.add(this.gameContainerModifier).add(this.gameContainer);
      this.add(this.gameContainerGameOverModifier).add(this.gameContainerGameOver);

      this._eventInput.on('gameOver', function() {
         this.gameContainerModifier.setOpacity(0, {curve: 'linear', duration: 500});
         this.gameContainerGameOverModifier.setOpacity(1, {curve: 'linear', duration: 200});
         this.gameContainer.unpipe(this.syncBackground);
      }.bind(this));

      this._eventInput.on('swapBackgrounds', function() {
         Timer.setTimeout(function() {
            this.gameContainer.pipe(this.syncBackground);
         }.bind(this), 200);
         this.gameContainerModifier.setOpacity(1, {curve: 'linear', duration: 500});
         this.gameContainerGameOverModifier.setOpacity(0, {curve: 'linear', duration: 200});
      }.bind(this));
   }

   function _createTitles() {
      var gameTitle = new Surface({
         size: [true, true],
         content: 'bouncy bit',
         properties: {
            textTransform: 'uppercase',
            font: '33px \'Orbitron\', sans-serif',
            color: this.options.gamePartsColor,
            pointerEvents: 'none'
         }
      });

      this.gameTitleModifier = new StateModifier({
         origin: [0.5, 0.5],
         align: [0.5, 0.5],
         transform: Transform.translate(0, -150, 0)
      });

      this.add(this.gameTitleModifier).add(gameTitle);

      var playText = new Surface({
         size: [true, true],
         properties: {
            textTransform: 'uppercase',
            font: '18px \'Orbitron\', sans-serif',
            color: this.options.gamePartsColor,
            pointerEvents: 'none',
         }
      });

      if (navigator.userAgent.match(/Android/i)) {
         playText.setContent('t&nbsp;a&nbsp;p  &nbsp;&nbsp;t&nbsp;o  &nbsp;&nbsp;p&nbsp;l&nbsp;a&nbsp;y');
      } else {
         playText.setContent('c&nbsp;l&nbsp;i&nbsp;c&nbsp;k  &nbsp;&nbsp;t&nbsp;o  &nbsp;&nbsp;p&nbsp;l&nbsp;a&nbsp;y');
      }

      this.playTextModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(0, 150, 0)
      });

      this.add(this.playTextModifier).add(playText);

      // show the game titles on start
      this._eventInput.on('gameStartTitles', function() {
         this.gameTitleModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
         this.playTextModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
      }.bind(this));
   }

   function _createTriangles() {
      var triangleUpDownSize = -137;

      for (var i = 0; i < 7; i++) {
         var triangleDown = new Surface({
            size: [true, true],
            properties: {
               width: '0',
               height: '0',
               borderLeft: '20px solid transparent',
               borderRight: '20px solid transparent',
               borderBottom: '20px solid ' + this.options.gamePartsColor
            }
         });

         var triangleUp = new Surface({
            size: [true, true],
            properties: {
               width: '0',
               height: '0',
               borderLeft: '20px solid transparent',
               borderRight: '20px solid transparent',
               borderTop: '20px solid ' + this.options.gamePartsColor
            }
         });

         var triangleDownModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(triangleUpDownSize, 231, 0)
         });

         var triangleUpModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(triangleUpDownSize, -251, 0)
         });

         this.add(triangleDownModifier).add(triangleDown);
         this.add(triangleUpModifier).add(triangleUp);

         triangleUpDownSize += 39;
      }

      var smallTriangleDownLeft = new Surface({
         size: [true, true],
         properties: {
            width: '0',
            height: '0',
            borderRight: '11px solid transparent',
            borderBottom: '11px solid ' + this.options.gamePartsColor
         }
      });

      var smallTriangleDownLeftModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(-144, 240, 0)
      });

      this.add(smallTriangleDownLeftModifier).add(smallTriangleDownLeft);

      var smallTriangleDownRight = new Surface({
         size: [true, true],
         properties: {
            width: '0',
            height: '0',
            borderLeft: '11px solid transparent',
            borderBottom: '11px solid ' + this.options.gamePartsColor
         }
      });

      var smallTriangleDownRightModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(134, 240, 0)
      });

      this.add(smallTriangleDownRightModifier).add(smallTriangleDownRight);

      var smallTriangleUpLeft = new Surface({
         size: [true, true],
         properties: {
            width: '0',
            height: '0',
            borderRight: '11px solid transparent',
            borderTop: '11px solid ' + this.options.gamePartsColor
         }
      });

      var smallTriangleUpLeftModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(-144, -250, 0)
      });

      this.add(smallTriangleUpLeftModifier).add(smallTriangleUpLeft);

      var smallTriangleUpRight = new Surface({
         size: [true, true],
         properties: {
            width: '0',
            height: '0',
            borderLeft: '11px solid transparent',
            borderTop: '11px solid ' + this.options.gamePartsColor
         }
      });

      var smallTriangleUpRightModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(134, -250, 0)
      });

      this.add(smallTriangleUpRightModifier).add(smallTriangleUpRight);
   }

   function _createLeftTrianglesView() {
      this.leftTrianglesView = new LeftTrianglesView({gamePartsColor: this.options.gamePartsColor});

      this.leftTrianglesViewModifier = new StateModifier();

      this.add(this.leftTrianglesViewModifier).add(this.leftTrianglesView);
   }

   function _createRightTrianglesView() {
      this.rightTrianglesView = new RightTrianglesView({gamePartsColor: this.options.gamePartsColor});

      this.rightTrianglesViewModifier = new StateModifier();

      this.add(this.rightTrianglesViewModifier).add(this.rightTrianglesView);
   }

   // backup both left and right triangles when the game is about to start
   InitialView.prototype.backupLeftRightTriangles = function() {
      this.leftTrianglesViewModifier.setTransform(Transform.translate(-26, 0, 0), this.trianglesTransition);
      this.rightTrianglesViewModifier.setTransform(Transform.translate(26, 0, 0), this.trianglesTransition);
   };

   InitialView.prototype.revealLeftRightTriangles = function() {
      this.leftTrianglesViewModifier.setTransform(Transform.translate(0, 0, 0), this.trianglesTransition);
      this.rightTrianglesViewModifier.setTransform(Transform.translate(0, 0, 0), this.trianglesTransition);
   };

   module.exports = InitialView;

});