(function ($, config) {
    "use strict"; // Start of use strict

    $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour

            //Contact Frm
            grecaptcha.ready(function () {
                grecaptcha.execute(config.recaptcha_site_key, {action: 'action_name'})
                    .then(function (token) {
                        // get values from FORM
                        var name = $("input#name").val();
                        var email = $("input#email").val();
                        var phone = $("input#phone").val();
                        var message = $("textarea#message").val();
                        var firstName = name; // For Success/Failure Message

                        // Check for white space in name for Success/Fail message
                        if (firstName.indexOf(' ') >= 0) {
                            firstName = name.split(' ').slice(0, -1).join(' ');
                        }

                        var messageButton = $("#sendMessageButton");
                        messageButton.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
                        $.ajax({
                            url: "message.php",
                            type: "POST",
                            data: {
                                name: name,
                                phone: phone,
                                email: email,
                                message: message,
                                token: token,
                            },
                            cache: false,
                            success: function () {
                                // Success message
                                $('#success').html("<div class='alert alert-success'>");
                                $('#success > .alert-success')
                                    .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
                                $('#success > .alert-success')
                                    .append("<strong>Votre message a bien été envoyé.</strong>");
                                $('#success > .alert-success')
                                    .append('</div>');
                                //clear all fields
                                $('#contactForm').trigger("reset");
                            },
                            error: function () {
                                // Fail message
                                $('#success').html("<div class='alert alert-danger'>");
                                $('#success > .alert-danger')
                                    .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
                                $('#success > .alert-danger').append(
                                    $("<strong>").text("Désolé " + firstName + ", on dirait que le message n'a pas pu être envoyé. Merci d'essayer un peu plus tard !"));
                                $('#success > .alert-danger').append('</div>');
                            },
                            complete: function () {
                                setTimeout(function () {
                                    messageButton.prop("disabled", false); // Re-enable submit button when AJAX call is complete
                                }, 1000);
                            }
                        });
                    });
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });

    /*When clicking on Full hide fail/success boxes */
    $('#name').focus(function () {
        $('#success').html('');
    });
})(jQuery, config); // End of use strict