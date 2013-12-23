  
  
var movie =  bonsai.run(document.getElementById('movie'), {
    width: window.innerWidth - 50,
    height: window.innerHeight - 25,
    code: function() {
        stage.sendMessage('ready', {});
    },
    plugins: [
      'js/board/interface.js'
    ]
// why the slash
  });
  
movie.on('load', function() {
    // receive event from the runner context
    movie.on('message:ready', function() {
      
      //main code
      
      movie.sendMessage("init-board");
      movie.sendMessage("draw-node", {a: 0, b: 0, c: 0});
      //var view = new board.views.BoardView({movie: movie});
      //view.render();
      
    });
  });