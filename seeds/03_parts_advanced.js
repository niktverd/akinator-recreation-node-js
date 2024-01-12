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

  const defaultReactionsObject = {slug: 'default', reactions: ['i_do_not_know', 'does_not_matter']};
  const groupBase = [
    {slug: 'basic', reactions: ['yes', 'no']},
    {slug: 'segments', reactions: ['body', 'brakes', 'light', 'motor', 'interior', 'transmission']},
    {slug: 'left_right', reactions: ['left', 'right', 'both']},
    {slug: 'front_rear', reactions: ['front', 'rear', 'both']},
    {slug: 'material', reactions: ['plastic', 'metal', 'many_materials']},
    {...defaultReactionsObject},
  ]
  
  const groups = groupBase.map((item) => ({slug: item.slug}));
  const reactionObject =  groupBase.reduce((acc, item) => {
    item.reactions.forEach((reaction) => {
      acc[reaction] = 1;
    })

    return acc;
  }, {});

  const reactions = Object.keys(reactionObject).map((reactionGroupSlug) => ({slug: reactionGroupSlug}));

  await knex('reactions').del()
  await knex('reactions').insert(reactions);

  await knex('reaction-groups').del()
  await knex('reaction-groups').insert(groups);

  await knex('reaction-reaction-group-relations').del();
  for (const group of groupBase) {
    if (group.slug === defaultReactionsObject.slug) {
      continue;
    }

    const [foundGroup] = await knex('reaction-groups').select().where({slug: group.slug});

    if (foundGroup) {
      for (const reaction of group.reactions) {
        const [foundReaction] = await knex('reactions').select().where({slug: reaction});

        if (foundReaction) {
          await knex('reaction-reaction-group-relations').insert([
            {reaction_id: foundReaction.id, reaction_group_id: foundGroup.id},
          ]);
        }
      }
      for (const reaction of defaultReactionsObject.reactions) {
        const [foundReaction] = await knex('reactions').select().where({slug: reaction});

        if (foundReaction) {
          await knex('reaction-reaction-group-relations').insert([
            {reaction_id: foundReaction.id, reaction_group_id: foundGroup.id},
          ]);
        }
      }
  }
  }


  const questionBase = [
    {text: 'Что вы ищите относится к :', reactionGroupSlug: 'segments'},
    {text: 'Что вы ищите находится :', reactionGroupSlug: 'left_right'},
    {text: 'Что вы ищите находится :', reactionGroupSlug: 'front_rear'},
    {text: 'Что вы ищите сделано из :', reactionGroupSlug: 'material'},
    {text: 'Что вы ищите нужно открыть, чтобы увидеть двигатель?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите используется для освещения или светового сигнала?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите показывает желание повернуть?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите служит для омывания стекол?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите можно наполнить жидкостью?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите имеет в своем составе резинку?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите протирает стекла?', reactionGroupSlug: 'basic'},
    {text: 'Что вы ищите служит для защиты машины от удара?', reactionGroupSlug: 'basic'},
  ];

  await knex('questions').del()

  const questionsToInsert = [];
  for (const question of questionBase) {
    console.log('question.reactionGroupSlug', question);
    const [foundGroup] = await knex('reaction-groups').select().where({slug: question.reactionGroupSlug});
    if (foundGroup) {
      questionsToInsert.push({
        text: question.text,
        reaction_group: foundGroup.id,
        hidden_from_ui: false,
        shown_only_for_doctors: false,
        possibility_of_this_is_next: 0.0,
      });
    }
  }

  await knex('questions').insert(questionsToInsert);
}