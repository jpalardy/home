/*global console: true, $: true, Handlebars: true, document: true */
(function () {

  var randRange = function (min, max) {
    return Math.floor(min + (max - min + 1) * Math.random());
  };

  var question = function () {
    var result = {numbers: [], sum: 0};
    var nums = randRange(2, 10);
    for (var i = 0; i < nums; i++) {
      var value = randRange(0, 9);
      result.numbers.push(value);
      result.sum += value;
    }
    return result;
  };

  var templates = {};
  templates.question = Handlebars.compile($('#question-template').html());

  $(function () {
    var howMany = Math.floor(document.body.clientWidth / 100);
    for (var i = 0; i < howMany; i++) {
      $('#questions').append(templates.question(question()));
    }
    $('.question th').click(function () {
      $(this).text($(this).attr('data-answer'));
      $(this).removeClass('unanswered');
    });
  });
}.call(this));
