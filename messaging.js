$(document).bind('pageinit', function () {
    jQuery.support.cors = true;

    $.connection.hub.url = 'http://192.168.2.60:31234/signalr';

    var chatHub = $.connection.chatHub;

    ClientMethods(chatHub);

    $("div[id*='webClients']").on('pageshow', function (event, ui) {
        $.connection.hub.start({ jsonp: true }, function () {
            ConnectToChatRoom(chatHub, window.localStorage["username"], true);
        });

        $.ajax({
            url: 'http://192.168.2.60:31234/api/login/',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (i, val) {
                    $('.webclients').append('<li><a href="Chat.html" class="client">' + val.Username + '</a></li>');
                    $('.webclients').listview('refresh');
                });
            }
        });

        $('.webclients').on('click', 'li', function () {
            window.localStorage["admin"] = $(this).text().trim();
        });
    });

    $("div[id*='chat']").on('pageshow', function (event, ui) {
        var to = window.localStorage["admin"];
        var from = window.localStorage["username"];

        $('.header h1').text(to);

        $.ajax({
        	url: 'http://192.168.2.60:31234/api/chat/',
        	type: 'POST',
        	dataType: 'json',
        	data: { From: to, To: from },
        	success: function (data) {
        		console.log(data);
        		//$('.conversation > li').remove();
        		$.each(data, function (key, value) {
        			var content = '<li data-icon="false"><a href=#><p><h2>' + value.From + ':</h2><strong>' + value.Message + '</strong></p><p class="ui-li-aside"><strong>' + new Date().toLocaleString() + '</strong></p>';
        			$('.conversation').append(content);
        		});
        		$('.conversation').listview('refresh');
        	}
        });

        $('#send').click(function () {
            var message = $('#message').val();
            SendMessage(chatHub, from, to, message);
        });
    });
});

function ConnectToChatRoom(chatHub, username, fromMobile) {
    chatHub.server.connect(username, fromMobile);
}

function SendMessage(chatHub, from, to, message) {
    chatHub.server.send(from, to, message);
}

function ClientMethods(chatHub) {
    chatHub.client.onConnected = function (connectionId, username) {
        console.log("Admin " + username + " with the Id of " + connectionId + "has been connected");
    }

    chatHub.client.onDisconnected = function (username) {
        console.log("Admin: " + username + " has been disconnected");
    }

    chatHub.client.pushMessage = function (from, message) {
    	if (window.localStorage["admin"] === from || window.localStorage["username"] === from) {
            var content = '<li data-icon="false"><a href=#><p><h2>' + from + ':</h2><strong>' + message + '</strong></p><p class="ui-li-aside"><strong>' + new Date().toLocaleString() + '</strong></p>';

            $('.conversation').append(content);
            $('.conversation').listview('refresh');
        }
    }
}
