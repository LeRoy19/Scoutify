from django.http import JsonResponse
from django.shortcuts import render
from SpotiGraph.crawler.graph import create_graph
from SpotiGraph.crawler import crawler
import json
from SpotiGraph.recommender_system import rec_sys


def home(request):
    return render(request, 'home.html')


def explore(request):
    token = json.dumps(crawler.client_credentials_manager.get_access_token())
    request.__setattr__('client', token)
    return render(request, 'explore.html')


def recommender(request):
    return render(request, 'recommender.html')


def graph(request):
    if request.GET.get('artist'):
        print(request.GET.get('artist'))
        request.__setattr__('artist', request.GET.get('artist'))
    return render(request, 'graph.html')


def get_graph(request):
    if request.is_ajax():
        name = request.GET.get('name')
        diameter = request.GET.get('diameter')
        graph = create_graph(500, name, int(diameter))
        return JsonResponse({"nodes": graph['data']['nodes'],
                             "links": graph['data']['links'],
                             "id": graph['data']['id']})


def authentication(request):
    pass


def track_recommender(request):
    if request.is_ajax():
        token = request.GET.get('token')
        last_played = crawler.get_recently_played(token, 10)
        ids = []
        for i in range(len(last_played)):
            for j in last_played[i]['artists']:
                ids.append(j['id'])
        print(ids)
        recommendations = rec_sys.recommend_by_artists(ids, 0.25)
        return JsonResponse({'recommendations': recommendations})


def art_recommender(request):
    if request.is_ajax():
        artists_names = request.GET.get('artists')
        artists_names = artists_names.split(', ')
        artist = []
        for name in artists_names:
            artist.append(crawler.api_get_id(name))
        recommendations = rec_sys.recommend_by_artists(artist, float(request.GET.get('accuracy')))
        return JsonResponse({'recommendations': recommendations, 'searched': artists_names})


def get_last_album(request):
    if request.is_ajax():
        data = crawler.spotify.artist_albums(artist_id=request.GET.get('id'), limit=1)
        url = data['items'][0]['external_urls']['spotify']
        ins = url.find('/album')
        return JsonResponse({'url': url[:ins] + '/embed' + url[ins:]})


def tags_recommender(request):
    if request.is_ajax():
        tags = request.GET.get('tags')
        tags = tags.split(', ')
        recommendations = rec_sys.recommend_by_tags(tags, float(request.GET.get('accuracy')))
        return JsonResponse({'recommendations': recommendations, 'searched': tags})


