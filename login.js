﻿$(document).ready(function () {
    $('#signin').click(function () {
        $.ajax({
            url: 'http://localhost:1246/api/login/',
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
        });
    });
});
