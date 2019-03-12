from rest_framework import serializers
from words.models import Word, Example
from homework.models import Conjugation, ConjugationExample, Tense
from words.serializers import ExampleSerializer, CollocationExampleSerializer
from .helpers import pull_conjugations_arrays, process_examples_by_tense, search_books
import re

class ConjugationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Conjugation
    fields = [ 'verb_form' ]

class VerbTenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Tense
    fields = [ 'num_id' ]

class VerbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

class ConjugationExampleSerializer(serializers.ModelSerializer):
  conjugation = serializers.SerializerMethodField('get_verb')

  def get_verb(self, instance):
    c = instance.conjugation
    return ConjugationSerializer(c).data

  class Meta:
    model = ConjugationExample
    fields = ['example', 'conjugation']


  def to_representation(self, instance):
    ret = super().to_representation(instance)
    vf = ret['conjugation']['verb_form']
    vf_re = r'\b' + vf + r'\b'
    if re.search(r'\(', vf):
      vf = re.sub(r'\(.*', '', vf)
      vf_re = r'\b(' + vf + r'.*?)\b'
      vf_match = re.search(vf_re, ret['example'], re.S|re.I)
     
      if vf_match:
        ret['example'] = re.sub(vf_re, "...", ret['example'], flags=re.I)
        ret['conjugation']['verb_form'] = vf_match[0] 
        return ret

      if re.search(r' ', vf):
        vf_p = vf.split(' ')
        vf_re = r'\b(' + vf_p[0] + r')(?![\w]).+?\b(' + vf_p[1] + r'.*?)\b'  
        print(vf_re)
      vf_match = re.search(vf_re, ret['example'], re.S|re.I)
      if vf_match:
        #print(ret['example'])
        #print(vf_match.group())
        ret['example'] = re.sub(vf_match[1], "...", ret['example'], flags=re.I)
        ret['example'] = re.sub(vf_match[2], "...", ret['example']) 
        ret['conjugation']['verb_form'] = vf_match[1] + (' ' + vf_match[2] if vf_match[2] else '')
        return ret
      else:
        print(vf_match)
        print(ret['example'])
        print(vf)
    else:
      vf_match = re.search(vf_re, ret['example'], re.S|re.I)
      if vf_match:
        print(vf_match.group(0))
        vf_re = r'\b' + vf + r'\b'
        ret['example'] = re.sub(vf_re, "...", ret['example'], flags=re.I)
        ret['conjugation']['verb_form'] = vf_match.group(0)
        return ret
      else:
        print(ret['example'])
        print(vf)
    #if re.search(r"\'", vf):
    #  vf_parts = vf.split("\'") 
    #  vf_pron = 
