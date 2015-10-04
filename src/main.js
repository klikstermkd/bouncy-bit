define(function(require, exports, module) {

   var Engine = require('famous/core/Engine');
   var Modifier = require('famous/core/Modifier');
   var Transform = require('famous/core/Transform');
   var FastClick = require('famous/inputs/FastClick');
   var AppView = require('views/AppView');

   var mainContext = Engine.createContext();
   var appView = new AppView();

   mainContext.add(appView);

});