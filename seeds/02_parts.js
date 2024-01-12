/**
  * @param { import("knex").Knex } knex
  * @returns { Promise<void> } 
  */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('answers').del()
  await knex('answers').insert([
    {text: 'Фара передняя правая'},
    {text: 'Фара передняя левая'},
    {text: 'Фара задняя правая'},
    {text: 'Фара задняя левая'},
    {text: 'Поворотник передний правый'},
    {text: 'Поворотник передний левый'},
    {text: 'Поворотник задний правый'},
    {text: 'Поворотник задний левый'},
    {text: 'Бампер передний'},
    {text: 'Бампер задний'},
    {text: 'Бампер передний'},
    {text: 'Бачок омывателя'},
    {text: 'Капот'},
    {text: 'Тормозные колодки передние'},
    {text: 'Тормозные колодки задние'},
    {text: 'Дворник правый'},
    {text: 'Дворник левый'},
  ]);

  await knex('questions').del()
  await knex('questions').insert([

    {text: 'Что вы ищите относится к ходовой части?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите относится к кузову?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите можно разделить на левую и правую части?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите можно охарактеризовать словами "Передний" "Задний"?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите находится справа?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите находится слева?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите находится впереди?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите находится сзади?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите часть тормозной системы?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите нужно открыть, чтобы увидеть двигатель?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите используется для освещения или светового сигнала?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите показывает желание повернуть?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите служит для омывания стекол?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите можно наполнить жидкостью?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите имеет в своем составе резинку?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите протирает стекла?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
    {text: 'Что вы ищите служит для защиты машины от удара?', hidden_from_ui: false, shown_only_for_doctors: false, possibility_of_this_is_next: 0.0},
  ]);
};