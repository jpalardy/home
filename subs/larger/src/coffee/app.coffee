
$ ->
  $('.source').keyup ->
    text = $(this).val()
    $('.destination').html(text)

  $('.source').focus()

