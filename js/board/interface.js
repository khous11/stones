function initBoad(board) {
  self.board = board || {size: 10};
}


function drawNode(a, b, c) {
  var x = self.board.size * sqrt(3) * (a + c/2)
  var y = self.board.size * 3/2 * c
  new Circle(x, y, self.board.size).fill('black').addTo(stage);
}

function removeNode(a, b, c) {
 
 throw "Not Implemented" 
  
}

stage.on("message:init-board", initBoard);
stage.on("message:draw-node", function(data){
  drawNode(data.a, data.b, data.c);
}); 