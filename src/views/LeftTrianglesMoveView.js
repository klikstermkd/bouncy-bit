define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Surface = require('famous/core/Surface');
   var Transform = require('famous/core/Transform');
   var StateModifier = require('famous/modifiers/StateModifier');

   function LeftTrianglesMoveView() {
      View.apply(this, arguments);

      this.triangles = [];
      this.trianglesLeftSize = [];
      this.trianglesModifiers = [];
      this.modifier = null;
      this.trianglePos = 0;
      this.numOfTriangles = 0;
      this.usedPositions = [];
      this.foundPos = false;

      _createTriangles.call(this);
   }

   LeftTrianglesMoveView.prototype = Object.create(View.prototype);
   LeftTrianglesMoveView.prototype.constructor = LeftTrianglesMoveView;

   LeftTrianglesMoveView.DEFAULT_OPTIONS = {
      gamePartsColor: '#191919'
   };

   function _createTriangles() {
      var triangleLeftSize = -240;

      for (var j = 0; j < 12; j++) {
         var triangleLeft = new Surface({
            size: [true, true],
            properties: {
               width: '0',
               height: '0',
               borderTop: '20px solid transparent',
               borderBottom: '20px solid transparent',
               borderLeft: '20px solid ' + this.options.gamePartsColor
            }
         });

         var triangleLeftModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(-164, triangleLeftSize, 0)
         });

         this.add(triangleLeftModifier).add(triangleLeft);
         this.triangles.push(triangleLeft);
         this.trianglesLeftSize.push(triangleLeftSize);
         this.trianglesModifiers.push(triangleLeftModifier);
         triangleLeftSize += 40;
      }
   }

   function _randomIntBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
   }

   // randomly show left triangles based on the number of points
   LeftTrianglesMoveView.prototype.moveLeftTriangles = function(points) {

      if (points === 1) {
         this.trianglePos = _randomIntBetween(0, 11);
         this.modifier = this.trianglesModifiers[this.trianglePos];
         this.modifier.setTransform(Transform.translate(-144, this.trianglesLeftSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         this.usedPositions.push(this.trianglePos);
         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points === 3) {
         this.numOfTriangles = _randomIntBetween(1, 2);

         for (j = 0; j < 2; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(-144, this.trianglesLeftSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }

         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points >= 5 && points <= 11) {
         this.numOfTriangles = _randomIntBetween(3, 6);

         for (j = 0; j < this.numOfTriangles; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(-144, this.trianglesLeftSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }
         
         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points >= 13 && points <= 21) {
         this.numOfTriangles = _randomIntBetween(4, 8);

         for (j = 0; j < this.numOfTriangles; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(-144, this.trianglesLeftSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }
         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      } else if (points > 22) {
         this.numOfTriangles = _randomIntBetween(5, 11);

         for (j = 0; j < this.numOfTriangles; j++) {
            this.trianglePos = _randomIntBetween(0, 11);

            while (this.usedPositions.indexOf(this.trianglePos) !== -1) {
               this.trianglePos = _randomIntBetween(0, 11);
            }

            this.usedPositions.push(this.trianglePos);
            this.modifier = this.trianglesModifiers[this.trianglePos];
            this.modifier.setTransform(Transform.translate(-144, this.trianglesLeftSize[this.trianglePos], 0), {curve: 'linear', duration: 200});
         }
         this._eventOutput.emit('orderOfTriangles', this.usedPositions);
         this.usedPositions = [];
      }
   };

   LeftTrianglesMoveView.prototype.backupLeftTriangles = function() {
      for (j = 0; j < 12; j++) {
         this.trianglesModifiers[j].setTransform(Transform.translate(-164, this.trianglesLeftSize[j], 0), {curve: 'linear', duration: 200});
      }
   };

   module.exports = LeftTrianglesMoveView;

});