$(document).ready( function() {
    $(document).on('change', '.btn-file :file', function() {
    $('#upldbtn').addClass('disabled');
    var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function(event, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if( input.length ) {
      var format=(log.substring(log.length-3));
            input.val(log);
      if(format==='png'||format==='jpg'||format==='peg'){
        $('#upldbtn').removeClass('disabled');
        $('#tble').css('visibility','hidden');
        $('#recognizeBlock').css('visibility','hidden');
        sessionStorage.setItem('format',format);
      }

      else
       alert('Only Jpg or Png Pictures Suppported');

        } else {
            if( log ) alert(log);
        }


    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-upload').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);


        }
    }

    $("#imgInp").change(function(){
        readURL(this);
    });
});
