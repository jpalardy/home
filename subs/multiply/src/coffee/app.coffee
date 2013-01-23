
SECONDS = 150
DONE    = false

testIsDone = ->
  return if DONE
  DONE = true
  clearInterval(handle)
  alert "DONE" if SECONDS is 0
  $("#questions input").each (i, elem) ->
    jqElem = $(elem)
    answer = jqElem.attr("data-answer")
    if jqElem.attr("value") is answer
      $(elem).addClass("good")
    else
      $(elem).addClass("bad")
    jqElem.attr("disabled","disabled")

handle = undefined
refreshTime = ->
  $('.timeleft').html("#{SECONDS}")
  testIsDone() if SECONDS is 0
  SECONDS = SECONDS - 1

$ ->
  questionsDOM = $('#questions')

  questions = []
  for i in [2..9]
    for j in [2..9]
      questions.push
        left: i
        right: j
        answer: i * j

  questions.sort -> Math.round(Math.random())-0.5
  questions = questions.slice(0,35)
  questions.forEach (q) ->
    questionsDOM.append("<div class=\"question\">#{q.left} x #{q.right} = <input data-answer=\"#{q.answer}\" type=\"text\" pattern=\"[0-9]*\"></input></div>\n")

  refreshTime()
  handle = setInterval(refreshTime, 1000)

  $('input[type=text]:first').focus()

window.done = testIsDone

