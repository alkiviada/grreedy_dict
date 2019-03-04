from django.conf.urls import url

from . import views
from .api import views as api_views

urlpatterns = [
    url(r'^homework/conjugate/', views.index, name='index'),
    url(r'^homework/verbs$', api_views.VerbsList.as_view(), name='verbs'),
    url(r'^homework/conjugations/(?P<word>[-\'\w() ]+)/(?P<language>(french|italian))/(?P<tense_idx>[0-9]+)$', api_views.Conjugate.as_view(), name='verb-conjugations'),
    url(r'^homework/tenses/(?P<word>[-\'\w() ]+)$', api_views.VerbTenses.as_view(), name='verb-tenses'),
    url(r'^homework/conjugate-homework/(?P<word>[-\'\w() ]+)/(?P<language>(french|italian))/(?P<tense_idx>[0-9]+)$', api_views.ConjugateHomework.as_view(), name='verb-conjugate-homework'),
]
