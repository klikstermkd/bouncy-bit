define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Surface = require('famous/core/Surface');
   var Transform = require('famous/core/Transform');
   var StateModifier = require('famous/modifiers/StateModifier');

   function RightTrianglesView() {
      View.apply(this, arguments);

      _createTriangles.call(this);
   }

   RightTrianglesView.prototype = Object.create(View.prototype);
   RightTrianglesView.prototype.constructor = RightTrianglesView;

   RightTrianglesView.DEFAULT_OPTIONS = {};

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
            transform: Transform.translate(124, triangleRightSize, 0)
         });

         this.add(triangleRightModifier).add(triangleRight);

         triangleRightSize += 40;
      }
   }

   module.exports = RightTrianglesView;

});