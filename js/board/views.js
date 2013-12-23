(function(board) {
  board.views = {};
  var v = board.views;
  
  v.BoardView = Backbone.View.extend({
    
    initialize: function(args) {
        this.movie = args.movie;
        this.testme = "hi";
    },
    
    
    render: function() {
      this.movie.sendMessage('delegate', this.drawBoard());
    },
    
    drawBoard: function() {
      var again = this.testme;
      return function(stage) {
         new Text(this.testme).addTo(stage).attr({
              fontFamily: 'Arial, sans-serif',
              fontSize: '20',
              textFillColor: 'red',
              textStrokeColor: 'yellow',
              textStrokeWidth: 3
            });
            
         new Text(again).addTo(stage).attr({
              fontFamily: 'Arial, sans-serif',
              fontSize: '36',
              textFillColor: 'blue',
              textStrokeColor: 'yellow',
              textStrokeWidth: 3,
              x: 80
            });
        
      }
      
    }
    
    
    
  });
  
})(window.board = window.board || {});