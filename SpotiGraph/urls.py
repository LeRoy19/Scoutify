from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^graph/$', views.get_graph, name="graph"),
    url(r'^authentication/$', views.authentication, name="auth"),
    url(r'^track_recommender/$', views.track_recommender, name="track_Rec"),
    url(r'^get_last_album/$', views.get_last_album, name="last_album"),
]