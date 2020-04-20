# Create your views here.

from django.shortcuts import render, redirect


def index(request):
    return render(request, "home.html")


def get_graph(request):
    pass


def authentication(request):
    pass


def track_recommender(request):
    pass


def get_last_album(request):
    pass
