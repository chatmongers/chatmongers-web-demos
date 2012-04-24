var BOSH_SERVICE = 'http-bind'

var muc_room = 'testmuc@muc.<host>.chatwith.it'

var connection = null

function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function rawInput(data)
{
    log('RECV: ' + data);
}

function rawOutput(data)
{
    log('SENT: ' + data);
}
function log_msg(msg)
{
    var from = msg.getAttribute('from');
    var elems = msg.getElementsByTagName('body');
    if (elems.length > 0){
        body = Strophe.getText(elems[0]);
        $('#messages').append('<div>'+from+': '+body+'</div>');
    }
    // Returning true keeps the message handler registered.
    return true;
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
        log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
        log('Strophe failed to connect.');
        $('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
        log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
        log('Strophe is disconnected.');
        $('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
        log('Strophe is connected.');
        var initpres = $pres();
        connection.send(initpres);
        connection.addHandler(log_msg, null, "message", null, null, null);
        joinstat = connection.muc.join(muc_room, connection.stream_id);
        //connection.disconnect();
    }
}

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    $('#connect').bind('click', function () {
    var button = $('#connect').get(0);
    if (button.value == 'connect') {
        button.value = 'disconnect';

        connection.connect($('#jid').get(0).value,
                   $('#pass').get(0).value,
                   onConnect);
    } else {
        button.value = 'connect';
        connection.disconnect();
    }
    });
});
