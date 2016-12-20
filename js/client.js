var ClientViewModel = {

};

var Sockets = (function() {
    var _socket = new WebSocket(webSocketUrl);
    var team = 1;

    _socket.onopen = function()
    {
        _socket.sendJson(ClientViewModel);
    }

    _socket.onmessage = function(msg){
        var data = JSON.parse(msg.data);

        /*if (data.type == "viewModel") {
            viewModel = data;
        }*/
    };

    return {
        Init: function(name, team, position) {

            ClientViewModel.name = name;
            ClientViewModel.team = team;
            ClientViewModel.position = position;
            var toSend = Object.assign({}, ClientViewModel);
            toSend.type = 'join';
            _socket.sendJson(toSend);
        },
        Send: function(data) {
            Send(data);
        }
    }
})();
