$(document).ready(function() {
    $("#profile-setting-error-message").fadeOut(0);
    var timeOut;
    $("#profileSettingButton").unbind("click").bind("click", function(e) {
        e.preventDefault()
        $.ajax({
            url: "/profile-setting",
            type: "POST",
            headers: {
                'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            data: {
                email: $("#adminEmail").val(),
                password: $("#adminPassword").val(),
                confirm_password: $("#adminConfirmPassword").val(),
            },
            dataType: "json",
            success: function(res) {
                if (res.success === true) {
                    $("#adminPassword").val('')
                    $("#adminConfirmPassword").val('')
                    $(".align-self-center .text-center")[0].innerText = $("#adminEmail").val()
                    $("#profile-setting-error-message").html('<div class="alert alert-success alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        res.message +
                        '</div>').fadeIn(1000)
                } else {
                    $("#profile-setting-error-message").html('<div class="alert alert-warning alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        res.message +
                        '</div>').fadeIn(1000)
                }

                clearTimeout(timeOut)
                timeOut = setTimeout(function() {
                    $("#profile-setting-error-message").fadeOut(1000)
                }, 5000)
            }
        })
    })
})