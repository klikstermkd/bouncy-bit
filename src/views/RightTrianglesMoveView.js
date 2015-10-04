define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Surface = require('famous/core/Surface');
   var Transform = require('famous/core/Transform');
   var StateModifier = require('famous/modifiers/StateModifier');

   function RightTrianglesMoveView() {
      View.apply(this, arguments);

      this.triangles = [];
      this.trianglesRightSize = [];
      this.trianglesModifiers = [];
      this.modifier = null;
      this.trianglePos = 0;
      this.numOfTriangles = 0;
      this.usedPositions = [];
      this.foundPos = false;

      _createTriangles.call(this);
   }

   RightTrianglesMoveView.prototype = Object.create(View.prototype);
   RightTrianglesMoveView.prototype.constructor = RightTrianglesMoveView;

   RightTrianglesMoveView.DEFAULT_OPTIONS = {
      gamePartsColor: '#191919'
   };

   function _createTriangles() {
      var triangleRightSize = -240;

      for (var j = 0; j < 12; j++) {
         var triangleRight = new Surface({
            size: [true, true],
            properties: {
               width: '0',
               height: '0',
               borderTop: '20px solid transparent',
               borderBottom: '20px solid transparent',
               borderRight: '20px solid ' + this.options.gamePartsColor
            }
         });

         var triangleRightModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(144, triangleRightSize, 0)
         });

         this.add(triangleRightModifier).add(triangleRight);
         this.triangles.push(triangleRight);
         this.trianglesRightSize.push(triangleRightSize);
         this.trianglesModifiers.push(triangleRightModifier);
         triangleRightSize += 40;
      }
   }

   function _randomIntBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
   }

   // randomly show rught triangles based on the number of points
   RightTrianglesMoveView.prototype.moveRightTriangles = function(points) {

      if (points === 0) {
         this.trianglePos = _randomIntBetween(0, 11);
         this.modifier = this.trianglesModifiers[this.trianglePos];
         this.modifier.setTransform(Transform.translate(124, this.trianglesRightSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         this.usedPositions.push(this.trianglePos);
         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points === 2) {
         this.numOfTriangles = _randomIntBetween(1, 2);

         for (j = 0; j < 2; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(124, this.trianglesRightSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }

         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points >= 4 && points <= 10) {
         this.numOfTriangles = _randomIntBetween(3, 6);

         for (j = 0; j < this.numOfTriangles; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(124, this.trianglesRightSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }

         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points >= 12 && points <= 20) {
         this.numOfTriangles = _randomIntBetween(4, 8);

         for (j = 0; j < this.numOfTriangles; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(124, this.trianglesRightSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }

         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points > 21) {
         this.numOfTriangles = _randomIntBetween(5, 11);

         for (j = 0; j < this.numOfTriangles; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(124, this.trianglesRightSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }

         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      }
   };

   RightTrianglesMoveView.prototype.backupRightTriangles = function() {
      for (j = 0; j < 12; j++) {
         this.trianglesModifiers[j].setTransform(Transform.translate(144, this.trianglesRightSize[j], 0), {curve: 'linear', duration: 200});
      }
   };

   module.exports = RightTrianglesMoveView;

});