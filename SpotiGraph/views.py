from django.shortcuts import render


# TODO create matrix construction algorithm
# TODO create matrix in a root folder as .npy file
# TODO update database with spotify profile url, indexes in matrix and last tags
# TODO create recommender system based on matrix previously created


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
