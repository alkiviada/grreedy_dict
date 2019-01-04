from bs4 import BeautifulSoup

def pull_conjugations_arrays(c):
  conjs_arr = []
  c_soup = BeautifulSoup(c, features="html.parser")
  conjs = c_soup.findAll('table')[0].findAll('tr')
  for c in conjs:
    tds = c.findAll('td')
    if len(tds) and tds[0]:
      conjs_arr.append(tds[0].get_text())
  return conjs_arr
