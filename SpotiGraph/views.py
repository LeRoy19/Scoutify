from django.http import JsonResponse
from django.shortcuts import render
from SpotiGraph.crawler.graph import create_graph
from SpotiGraph.crawler import crawler


# TODO create matrix construction algorithm
# TODO create recommender system based on matrix previously created


def index(request):
    return render(request, "home.html")


def get_graph(request):
    if request.is_ajax():
        name = request.POST.get('name')
        diameter = request.POST.get('diameter')
        graph = create_graph(300, name, int(diameter))
        return JsonResponse({"nodes": graph['data']['nodes'],
                             "links": graph['data']['links']})


def authentication(request):
    pass


def track_recommender(request):
    pass


def get_last_album(request):
    if request.is_ajax():
        data = crawler.spotify.artist_albums(artist_id=request.GET.get('id'), limit=1)
        url = data['items'][0]['external_urls']['spotify']
        ins = url.find('/album')
        return JsonResponse({'url': url[:ins] + '/embed' + url[ins:]})
