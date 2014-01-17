
function actualize(board) {
    var empty = board.collection.where({'owner': undefined});
    if (empty.length) return;

    board.collection.each(function(model) {
        if (model.conquered() != model.get('owner')) model.set('marked', model.conquered().get('owner'));
    });

    board.collection.each(function(model) {
        if (model.get('marked')) model.set('owner', model.get('marked'));
        model.set('type', 'circle');
    });

    board.$el.getStage().on('click', function(){ window.location.reload();});
}

var stage = new Kinetic.Stage({
    container: 'movie',
    width: 400,
    height: 420
});

var board = new board.views.BoardView({
    stage: stage,
    node_size: 60,
    width: 400,
    height: 360,
    collection: board.examples.triangle_board
});

var ctlbar = new ctlbar.views.ControlBar({
    layer: board.node_layer,
    button_size: 20
});

var player_one = new player.models.Player({name: 'Player One', color: 'maroon'});
var player_two = new player.models.Player({name: 'Player Two', color: 'darkblue'});

var current_player = player_one;
var active_node = null;
var active_button = null;

function togglePlayer() {
    if (current_player == player_one) {
        current_player = player_two;
    } else {
        current_player = player_one;
    }

    _.each(ctlbar.buttons, function(item) {
        item.$el.setFill(current_player.get('color'));
    });
}

board.on('deactivateAll', function() {active_node = null;});
board.collection.on('change:active', function (model, value, options) {
    if (!value) return;
    if (active_button) {
        if (!model.get('owner')) {
            model.set('owner', current_player);
            model.set('type', active_button.type);
            model.deactivate();
            active_node = null;
            active_button.deactivate();
            active_button = null;
            togglePlayer();
            actualize(board);
        }
    } else {
        active_node = model;
    }
});


ctlbar.on('button:activate', function (button) {
    if (active_node) {
        if (!active_node.get('owner')) {
            active_node.set('owner', current_player);
            active_node.set('type', button.type);
            active_node.deactivate();
            active_node = null;
            button.deactivate();
            active_button = null;
            togglePlayer();
            actualize(board);
        }
    } else {
        active_button = button;
    }
});

