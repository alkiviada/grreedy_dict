from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^api/word/(?P<word>[-\w]+)$', views.WordSingleCreate.as_view(), name='word-detail'),
    url(r'^api/word/translate/(?P<word>[-\w]+)$', views.WordSingleCreateTranslate.as_view(), name='word-translate'),
    url(r'^api/word/collocations/(?P<word>[-\w]+)$', views.WordSingleCreateCollocations.as_view(), name='word-collocations'),
    url(r'^api/word/$', views.WordList.as_view(), name='words'),
    url(r'^api/collection/$', views.CollectionListCreate.as_view(), name='save-collection'),
    url(r'^api/collection/(?P<uuid>[0-9a-f-]+)$', views.CollectionDetail.as_view(), name='collection-detail'),
    url("^api/auth/register/$", views.RegistrationAPI.as_view()),
    url("^api/auth/login/$", views.LoginAPI.as_view()),
    url("^api/auth/user/$", views.UserAPI.as_view()),
    url(r'^api/auth/', include('knox.urls')),
]
