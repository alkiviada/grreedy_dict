export const prons = { 'french': ['je', 'tu', 'il', 'nous', 'vous', 'ils'],
                       'italian': ['io', 'tu', 'lui', 'noi', 'voi', 'loro'],
                     }
export const tenses = ['present', 'past progressive', 'simple past', 'future', 'preterite past', ]

export const countMatches = (str) => {
  const re = /(\.\.\.)/g
  return ((str || '').match(re) || []).length
}
