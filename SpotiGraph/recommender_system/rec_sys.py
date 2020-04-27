import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from SpotiGraph.crawler import crawler


def cosine(vec1: np.array, vec2: np.array):
    vec1 = vec1.reshape(1, -1)
    vec2 = vec2.reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]


def recommend(artist: int, number: int = None) -> list:
    if number is None:
        number = 5
    artists = crawler.get_artists_by_row()
    matrix = np.load(r"C:\Users\guast\PycharmProjects\Tesi_Spotify\matrix\tags_matrix.npy")
    artist_row = matrix[artist]
    similarities = [{'similarity': -1} for i in range(number)]
    for i in range(len(matrix)):
        if i != artist:
            similarity = cosine(artist_row, matrix[i])
            if similarity >= 0.55:
                for j in similarities:
                    if j['similarity'] < similarity:
                        similarities.remove(min(similarities, key=lambda x: x['similarity']))
                        val = artists[i]
                        val['similarity'] = similarity
                        similarities.append(val)
                        break
    return similarities


