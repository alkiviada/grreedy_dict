from django.conf.urls import url, include

from . import views
from knox import views as knox_views
from homework.api import views as homework_views

urlpatterns = [
    url(r'^api/word/translate/(?P<word>[-\'\w() ]+)$', views.WordSingleCreateTranslate.as_view(), name='word-translate'),
    url(r'^api/word/pronounce/(?P<word>[-\'\w() ]+)$', views.WordSingleCreatePronounce.as_view(), name='word-pronounce'),
    url(r'^api/word/conjugate/(?P<word>[-\'\w() ]+)$', views.WordSingleCreateConjugate.as_view(), name='word-conjugate'),
    url(r'^api/word/synonyms/(?P<word>[-\'\w() ]+)$', views.WordSingleCreateSynonyms.as_view(), name='word-synonyms'),
    url(r'^api/word/collocations/(?P<word>[-\'\w() ]+)$', views.WordSingleCreateCollocations.as_view(), name='word-collocations'),

    url(r'^api/word/note/post/$', views.WordNoteSingleCreate.as_view(), name='word-note-post'),
    url(r'^api/word/note/(?P<word>[-\'\w() ]+)/(?P<uuid>[0-9a-f-]+)$', views.WordNoteSingleDetail.as_view(), name='word-note'),

    url(r'^api/word/(?P<word>[-\'\w() ]+)/(?P<uuid>[0-9a-f-]+)?$', views.WordSingleCreate.as_view(), name='word-detail'),
    url(r'^api/word/delete/(?:(?P<word>[-\'\w() ]+)/(?P<uuid>[0-9a-f-]+)/(?P<page>[0-9]+)/(?P<time>[0-9]+)?)?$', views.WordSingleDelete.as_view(), name='word-delete'),
    url(r'^api/words/(?:(?P<uuid>[0-9a-f-]+)/(?P<page>[0-9]+)/(?P<time>[0-9]+)?)?$', views.WordList.as_view(), name='words'),


    url(r'^api/collection/$', views.CollectionListCreate.as_view(), name='save-collection'),
    url(r'^api/collection/(?P<uuid>[0-9a-f-]+)/(?:/(?P<time>[0-9]+))?$', views.CollectionDetail.as_view(), name='collection-detail'),
    url(r'^api/collection/lastmodified/(?P<uuid>[0-9a-f-]+)/(?P<time>[0-9]+)/$', views.CollectionModified.as_view(), name='collection-last-modified'),

    url("^api/auth/register/$", views.RegistrationAPI.as_view()),
    url("^api/auth/login/$", views.LoginAPI.as_view(), name='words_login'),
    url(r'^api/auth/logout/$', knox_views.LogoutView.as_view(), name='knox_logout'),
    url(r'api/auth/logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
    url("^api/auth/user/$", views.UserAPI.as_view()),
    url(r'^api/auth/', include('knox.urls')),
]
