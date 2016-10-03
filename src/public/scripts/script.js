/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function() {
    var clipboardButton = document.querySelector('#clipboard_btn');

    clipboardButton.addEventListener('click', function() {
        var addonUrl = document.querySelector('#addon_url');
        addonUrl.select();
        var confirmationSpan = document.querySelector('#copied_confirmation');
        try {
            var successful = document.execCommand('copy');
            if (successful) {
                confirmationSpan.style.transition = 'opacity 0.1s linear';
                confirmationSpan.style.opacity = 1;
                clipboardButton.addEventListener('mouseout', function() {
                    confirmationSpan.style.transition = 'opacity 0.33s linear';
                    confirmationSpan.style.opacity = 0;
                });
            }
        } catch (err) {
            console.log('Copying failed: ' + err);
        }
    });
});