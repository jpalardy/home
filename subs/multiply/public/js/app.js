(function() {
  var DONE, SECONDS, handle, refreshTime, testIsDone;

  SECONDS = 150;

  DONE = false;

  testIsDone = function() {
    if (DONE) return;
    DONE = true;
    clearInterval(handle);
    if (SECONDS === 0) alert("DONE");
    return $("#questions input").each(function(i, elem) {
      var answer, jqElem;
      jqElem = $(elem);
      answer = jqElem.attr("data-answer");
      if (jqElem.attr("value") === answer) {
        $(elem).addClass("good");
      } else {
        $(elem).addClass("bad");
      }
      return jqElem.attr("disabled", "disabled");
    });
  };

  handle = void 0;

  refreshTime = function() {
    $('.timeleft').html("" + SECONDS);
    if (SECONDS === 0) testIsDone();
    return SECONDS = SECONDS - 1;
  };

  $(function() {
    var i, j, questions, questionsDOM;
    questionsDOM = $('#questions');
    questions = [];
    for (i = 2; i <= 9; i++) {
      for (j = 2; j <= 9; j++) {
        questions.push({
          left: i,
          right: j,
          answer: i * j
        });
      }
    }
    questions.sort(function() {
      return Math.round(Math.random()) - 0.5;
    });
    questions = questions.slice(30);
    questions.forEach(function(q) {
      return questionsDOM.append("<div class=\"question\">" + q.left + " x " + q.right + " = <input data-answer=\"" + q.answer + "\" type=\"text\"></input></div>\n");
    });
    refreshTime();
    handle = setInterval(refreshTime, 1000);
    return $('input[type=text]:first').focus();
  });

  window.done = testIsDone;

}).call(this);
