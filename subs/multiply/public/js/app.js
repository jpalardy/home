/* global $, alert */

(function () {
  'use strict';

  var seconds = 150;
  var done    = false;
  var handle;

  var testIsDone = function () {
    if (done) {
      return;
    }
    done = true;
    clearInterval(handle);
    if (seconds === 0) {
      alert("DONE");
    }
    $("#questions input").each(function (i, elem) {
      var jqElem = $(elem);
      var answer = jqElem.attr("data-answer");
      jqElem.addClass(jqElem.attr("value").trim() === answer ? "good" : "bad").attr("disabled", "disabled");
    });
  };

  var refreshTime = function () {
    $('.timeleft').html(seconds);
    if (seconds === 0) {
      testIsDone();
    }
    seconds = seconds - 1;
  };

  $(function () {
    var questionsDOM = $('#questions');
    var questions = [];
    for (var i = 2; i <= 9; i++) {
      for (var j = 2; j <= 9; j++) {
        questions.push({left: i, right: j, answer: i * j});
      }
    }
    questions.sort(function () { return Math.round(Math.random()) - 0.5; }); // shuffle
    questions = questions.slice(0, 35);
    questions.forEach(function (q) {
      return questionsDOM.append("<div class=\"question\">" + q.left + " x " + q.right + " = <input data-answer=\"" + q.answer + "\" type=\"text\" pattern=\"[0-9]*\"></input></div>\n");
    });
    refreshTime();
    handle = setInterval(refreshTime, 1000);
    $('input[type=text]:first').focus();
    $('#done').click(testIsDone);
  });
}());
