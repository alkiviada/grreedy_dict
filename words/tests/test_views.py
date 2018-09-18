import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from words.models import Word
from words.serializers import WordSerializer
from faker import Faker
from django.utils import timezone

client = Client()
myFactory = Faker()

class GetAllFreeWordsTest(TestCase):
    """ Test module for GET all words API """

    def setUp(self):
        [ Word.objects.create(word=w, lookup_date=timezone.now()) for w in myFactory.words() ]

    def test_get_all_free_words(self):
        # get API response
        response = client.get(reverse('words'))
        # get data from db
        words = Word.free_words.all()
        serializer = WordSerializer(words, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_free_words_order(self):
        # get API response
        response = client.get(reverse('words'))
        # get data from db
        self.assertEqual(response.status_code, status.HTTP_200_OK)

