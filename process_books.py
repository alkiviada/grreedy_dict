#!/usr/bin/env python
import os
import sys
import django
import re
import glob

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_dict.settings")
django.setup()

from bs4 import BeautifulSoup, NavigableString


book_map = {}
book_heads = []
p_count = 0 
page_count = 1
book_head = ''


for filename in sorted(glob.glob("grreedy_library/flaubert/bovary/OEBPS/@public@vhost@g@gutenberg@html@files@48359@48359-h@48359-h*"), key=lambda a: (int(a.split('.')[0].split('-')[3]))):
  with open(filename,'r') as f:
    output = f.read()
  p_count = 0
  book_soup = BeautifulSoup(output, features="html.parser")
  book_parts = book_soup.findAll(['h2','p'])
  for part in book_parts:
    if part.name == 'h2': 
      if re.search('([XIV]+)', part.get_text()):
        if book_head:
          book_map[page_count]['end'] = p_count
          if book_map[page_count]['file_start'] != filename:
            book_map[page_count]['file_end'] = filename
          else:
            book_map[page_count]['file_end'] = book_map[page_count]['file_start']
          page_count = page_count + 1
        book_head = part.get_text()
        if book_head:
          book_map[page_count] = {'title': book_head, 'start': p_count, 'end': 0, 'file_start': filename}
          book_heads.append(book_head)
    else:
      if book_head:
        p_count = p_count + 1
  
#[ print(k, ' ', book_map[k])  for k in book_heads ] 
import json
with open('grreedy_library/flaubert/bovary/bovary.json', 'w') as fp:
  json.dump(book_map, fp)
#with open('data.json', 'r') as fp:
#  e = json.load(fp)

#[ print(k, ' ', e[k]['ifls'], ' ', len(e[k]['examples']))  for k in e.keys() ] 
