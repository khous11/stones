var stage = new Kinetic.Stage({
    container: 'movie',
    width: 400,
    height: 600
});

var board = new board.views.BoardView({stage: stage, node_size: 60, width: 400, height: 360, collection: board.examples.triangle_board});


