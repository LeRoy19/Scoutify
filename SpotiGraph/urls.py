from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^home/$', views.index, name="home"),
    url(r'^graph/$', views.graph, name="graph"),
    url(r'^authentication/$', views.authentication, name="auth"),
    url(r'^recommender/$', views.recommender, name="recommender"),
    url(r'^art_recommender/$', views.art_recommender, name="art_Rec"),
    url(r'^get_last_album/$', views.get_last_album, name="last_album"),
    url(r'^track_recommender/$', views.track_recommender, name="track_recommender"),
    url(r'^get_graph/$', views.get_graph, name="get_graph")]