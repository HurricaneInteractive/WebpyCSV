$ = jQuery.noConflict();
$(document).ready(function() {

    jQuery.fn.selectText = function(){
        var doc = document
            , element = this[0]
            , range, selection
        ;
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();        
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    $('#select').on('click', function(e) {
        e.preventDefault();
        $('#result').selectText();
    });

    $(document).on('submit', '#csv-upload', function(e) {
        e.preventDefault();
        // var data = $('#csv_upload')[0];
        if ($('#csv_upload')[0].files.length < 1) {
            $('#result').append('<div class="rounded m-0 alert alert-danger" role="alert">Did you even try?</div>');
            return false;
        }
        var fd = new FormData();
        fd.append('csv_upload', $('#csv_upload')[0].files[0]);

        var other_input = $(this).serializeArray();
        $.each(other_input, function(key, input) {
            if (input.name == 'delimiter') {
                if (input.value.trim() == '') {
                    input.value = ',';
                }
            }
            fd.append(input.name, input.value);
        });

        $.ajax({
            url: '/processCSV',
            data: fd,
            type: 'POST',
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(res) {
                code = JSON.stringify(res, null, 4);
                $('#result').parent().show();
                $('#result').empty().append('<pre>' + code + '</pre>');
            },
            error: function(err) {
                $('#result').append('<div class="rounded m-0 alert alert-danger" role="alert">' + err.responseText + '</div>');
                return false;
            }
        });
    });
});