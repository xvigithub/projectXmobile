$(document).ready(function () {
    $('#signin').click(function () {
        $.ajax({
            url: 'http://192.168.0.104:31234/api/login/',
            type: 'POST',
            dataType: "json",
            data: {
                Username: $('#username').val(),
                Password: $('#password').val()
            },
            crossDomain: true,
            success: function (data) {
                if (data === "ok") {
                    var username = $('#username').val();
                    window.localStorage["username"] = username;
                    $.mobile.changePage("Messaging.html", { transition: "slideup" });
                }
                else { alert("Invalid login details."); }
            }
        }).fail(function (e, a) {
    		window.alert(e + " " +a);
    	});
    });
});
