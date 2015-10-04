define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Surface = require('famous/core/Surface');
   var Transform = require('famous/core/Transform');
   var StateModifier = require('famous/modifiers/StateModifier');

   function LeftTrianglesView() {
      View.apply(this, arguments);

      _createTriangles.call(this);
   }

   LeftTrianglesView.prototype = Object.create(View.prototype);
   LeftTrianglesView.prototype.constructor = LeftTrianglesView;

   LeftTrianglesView.DEFAULT_OPTIONS = {};

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
            transform: Transform.translate(-144, triangleLeftSize, 0)
         });

         this.add(triangleLeftModifier).add(triangleLeft);

         triangleLeftSize += 40;
      }
   }

   module.exports = LeftTrianglesView;

});