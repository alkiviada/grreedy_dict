from django.conf.urls import url

from . import views
from .api import views as api_views

urlpatterns = [
    url(r'^homework/conjugate/', views.index, name='index'),
    url(r'^homework/verbs$', api_views.VerbsList.as_view(), name='verbs'),
    url(r'^homework/conjugations/(?P<word>[-\'\w() ]+)$', api_views.Conjugate.as_view(), name='verb-conjugations'),
]
