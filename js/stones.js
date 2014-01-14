var stage = new Kinetic.Stage({
    container: 'movie',
    width: 500,
    height: 500
});

var board = new board.views.BoardView({stage: stage, node_size: 50, height: 400, collection: board.examples.triangle_board});


