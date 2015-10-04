define(function(require, exports, module) {

   var View = require('famous/core/View');
   var Surface = require('famous/core/Surface');
   var Transform = require('famous/core/Transform');
   var StateModifier = require('famous/modifiers/StateModifier');
   var MouseSync = require('famous/inputs/MouseSync');
   var TouchSync = require('famous/inputs/TouchSync');
   var GenericSync = require('famous/inputs/GenericSync');

   GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

   function ScoreView() {
      View.apply(this, arguments);

      this.score = 0;
      this.sync = new GenericSync({'mouse': {}, 'touch': {}});

      _createScoreScreen.call(this);
   }

   ScoreView.prototype = Object.create(View.prototype);
   ScoreView.prototype.constructor = ScoreView;

   ScoreView.DEFAULT_OPTIONS = {
      gamePartsColor: '#222222'
   };

   function _createScoreScreen() {

      this.gameOverTitle = new Surface({
         size: [true, true],
         content: 'game over',
         properties: {
            font: '32px \'Orbitron\', sans-serif',
            color: '#FDFDFD',
            zIndex: 1,
            pointerEvents: 'none',
            textTransform: 'uppercase',
         }
      });

      this.gameOverTitleModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(0, -150, 0),
         opacity: 0
      });

      this.add(this.gameOverTitleModifier).add(this.gameOverTitle);

      this.scoreTitle = new Surface({
         size: [true, true],
         content: 'score',
         properties: {
            font: '20px \'Orbitron\', sans-serif',
            color: '#62050A',
            zIndex: 1,
            pointerEvents: 'none',
            textTransform: 'uppercase'
         }
      });

      this.scoreTitleModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(-70, -50, 0),
         opacity: 0
      });

      this.add(this.scoreTitleModifier).add(this.scoreTitle);

      this.scoreTitleValue = new Surface({
         size: [true, true],
         content: '',
         properties: {
            font: '26px \'Orbitron\', sans-serif',
            color: '#FDFDFD',
            zIndex: 1,
            pointerEvents: 'none',
         }
      });

      this.scoreTitleValueModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(-70, -20, 0),
         opacity: 0
      });

      this.add(this.scoreTitleValueModifier).add(this.scoreTitleValue);

      this.scoreBest = new Surface({
         size: [true, true],
         content: 'best',
         properties: {
            font: '20px \'Orbitron\', sans-serif',
            color: '#62050A',
            zIndex: 1,
            pointerEvents: 'none',
            textTransform: 'uppercase'
         }
      });

      this.scoreBestModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(70, -50, 0),
         opacity: 0
      });

      this.add(this.scoreBestModifier).add(this.scoreBest);

      this.scoreBestValue = new Surface({
         size: [true, true],
         content: '0',
         properties: {
            font: '26px \'Orbitron\', sans-serif',
            color: '#FFFF33',
            zIndex: 1,
            pointerEvents: 'none',
            textTransform: 'uppercase'
         }
      });

      this.scoreBestValueModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(70, -20, 0),
         opacity: 0
      });

      this.add(this.scoreBestValueModifier).add(this.scoreBestValue);

      this.scoreCounter = new Surface({
         size: [true, true],
         content: '0',
         properties: {
            font: '37px \'Orbitron\', sans-serif',
            color: '#717171',
            zIndex: 1,
            pointerEvents: 'none'
         }
      });

      this.scoreCounterModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.multiply(Transform.scale(1, 1.3, 1), Transform.translate(0, -140, 0)),
         opacity: 0
      });

      this.add(this.scoreCounterModifier).add(this.scoreCounter);

      this._eventInput.on('increaseCounter', function(data) {
         this.scoreCounter.setContent(data);
      }.bind(this));

      this._eventInput.on('resetCounter', function() {
         this.scoreCounter.setContent('0');
      }.bind(this));

      this.playButton = new Surface({
         size: [true, true],
         properties: {
            width: '0',
            height: '0',
            borderTop: '30px solid transparent',
            borderBottom: '30px solid transparent',
            borderLeft: '50px solid #FDFDFD'
         }
      });

      this.playButtonModifier = new StateModifier({
         align: [0.5, 0.5],
         origin: [0.5, 0.5],
         transform: Transform.translate(-23, 80, 0),
         opacity: 0
      });

      this.add(this.playButtonModifier).add(this.playButton);

      this.playButton.pipe(this.sync);

      this.sync.on('start', function() {
         this.playButtonModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.gameOverTitleModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.scoreTitleModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.scoreBestModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.scoreCounterModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.scoreTitleValueModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.scoreBestValueModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this._eventOutput.emit('gameStart');
         this.playButton.setProperties({zIndex: -1});
      }.bind(this));

      this._eventInput.on('gameOver', function(data) {
         this.playButton.setProperties({zIndex: 0});
         this.playButtonModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
         this.gameOverTitleModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
         this.scoreTitleModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
         this.scoreBestModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
         this.scoreCounterModifier.setOpacity(0, {curve: 'easeOut', duration: 100});
         this.scoreTitleValue.setContent(data, {curve: 'easeOut', duration: 100});
         this.scoreTitleValueModifier.setOpacity(1, {curve: 'easeOut', duration: 100});

         if (localStorage.bestScore) {
            if (parseInt(data, 10) > localStorage.bestScore) {
               localStorage.bestScore = data;
            }
         } else {
            localStorage.bestScore = data;
         }

         this.scoreBestValue.setContent(localStorage.bestScore, {curve: 'easeOut', duration: 2000});
         this.scoreBestValueModifier.setOpacity(1, {curve: 'easeOut', duration: 100});
      }.bind(this));

      this._eventInput.on('gameStarted', function() {
         this.scoreCounterModifier.setOpacity(1, {curve: 'linear', duration: 100});
      }.bind(this));
   }

   module.exports = ScoreView;

});