
function NetworkCooldownInputKeyboardStub(team, property, position) {
    this.team = team;
    this.property = property;
    this.position = position;
    this.vacant = true;
}

NetworkCooldownInputKeyboardStub.prototype = {
    isDown: function(char) {

        var team = this.team();
        if (!team)
            return 0;
        var flag1 = 0;
        this.vacant = true;
        var that = this;
        team.members.forEach(function (member) {
            var state = member.state;
            if (!state)
                return;

            if (member.position == that.position)
                that.vacant = false;
            if (state[that.property] == 1) 
                flag1 = 1;
        });

        return flag1;
    }
};

function NetworkBiDiInput(team, propertyForward, propertyBackward, positionForward, positionBackward) {
    this.team = team;
    this.propertyForward = propertyForward;
    this.propertyBackward = propertyBackward;
    this.positionForward = positionForward;
    this.positionBackward = positionBackward ? positionBackward : positionForward;
    this.vacantForward = true;
    this.vacantBackward = true;
}

NetworkBiDiInput.prototype = {
    read: function() {
        this.valueForward = 0;
        this.valueBackward = 0;
        this.vacantForward = true;
        this.vacantBackward = true;

        var team = this.team();
        if (!team)
            return 0;

        var that = this;
        team.members.forEach(function (member) {
            var state = member.state;
            if (!state)
                return;

            if (member.position == that.positionForward)
                that.vacantForward = false;
            if (state[that.propertyForward] == 1)
                that.valueForward = 1;
            
            if (member.position == that.positionBackward)
                that.vacantBackward = false;
            if (state[that.propertyBackward] == 1)
                that.valueBackward = 1;
        });

        if(this.valueForward == this.valueBackward)
            return 0;
        if(this.valueForward)
            return 1;
        if(this.valueBackward)
            return -1;
    }
}

var Sockets = (function() {

    if(_socket) {
        _socket.onopen = function()
        {
            _socket.sendJson({
                isAdmin: true,
            });
        }

        _socket.onmessage = function(msg){
            var data = JSON.parse(msg.data);
            console.log('got msg ' + msg.data);

            if (data.type == 'ViewModel') {
                Sockets.ViewModel = data;
                if (Sockets.UpdateCallback) {
                    Sockets.UpdateCallback();
                }
            }

        }
    }

    return {
        ViewModel: {
            teams: [],
        },
        UpdateCallback: null
    };
})();
