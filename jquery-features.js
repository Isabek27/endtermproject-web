// jQuery: selectors, traversal, two events, and two effects.
$(document).ready(function () {
  // Class selector + click event + closest() + find() + slideToggle().
  $('.help-button').on('click', function () {
    $(this).closest('.card').find('.help-content').slideToggle(200);
  });

  // ID selector + change event + closest() + find() + fadeIn().
  $('#topic').on('change', function () {
    const tips = {
      api: 'API: укажите, какие статистические данные вам интересны.',
      bug: 'Ошибка: опишите страницу и шаги, которые привели к проблеме.',
      partner: 'Сотрудничество: расскажите о своей идее.'
    };
    const chosen = $(this).val();
    const tip = $(this).closest('.card').find('#topicTip');
    if (!chosen) { tip.hide(); return; }
    tip.text(tips[chosen]).hide().fadeIn(250);
  });
});