import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from SpotiGraph.crawler import crawler


def cosine(vec1: np.array, vec2: np.array):
    vec1 = vec1.reshape(1, -1)
    vec2 = vec2.reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]


def logic_or(arrays: list) -> np.array:
    if len(arrays) > 1:
        ret_val = np.logical_or(arrays[0], arrays[1], dtype=int)
        for i in range(2, len(arrays)):
            ret_val = np.logical_or(ret_val, arrays[i], dtype=int)
        return np.array(ret_val, dtype=int)
    elif len(arrays) == 1:
        return arrays[0]
    else:
        raise Exception("length of arrays must be > 0")


# to check
def recommend_by_artists(artists: list, accuracy: float, number: int = None) -> list:
    if number is None:
        number = 5
    all_artists = crawler.get_artists_by_row()
    matrix = np.load(r"C:\Users\guast\PycharmProjects\Tesi_Spotify\matrix\tags_matrix.npy")
    artists_tags = logic_or([matrix[i] for i in artists])
    similarities = [{'similarity': -1} for i in range(number)]
    for i in range(len(matrix)):
        if i not in artists:
            similarity = cosine(artists_tags, matrix[i])
            if similarity >= accuracy:
                for j in similarities:
                    if j['similarity'] < similarity:
                        similarities.remove(min(similarities, key=lambda x: x['similarity']))
                        val = all_artists[i]
                        val['similarity'] = similarity
                        similarities.append(val)
                        break
    return similarities


# to check
def recommend_by_tags(tags: list, accuracy: float, number: int = None) -> list:
    if number is None:
        number = 5
    all_artists = crawler.get_artists_by_row()
    matrix = np.load(r"C:\Users\guast\PycharmProjects\Tesi_Spotify\matrix\tags_matrix.npy")
    tags_row = np.zeros(len(matrix[0]), dtype=int)
    for tag in tags:
        tags_row[crawler.get_tag_column(tag)] = 1
    similarities = [{'similarity': -1} for i in range(number)]
    for i in range(len(matrix)):
        similarity = cosine(tags_row, matrix[i])
        if similarity >= accuracy:
            for j in similarities:
                if j['similarity'] < similarity:
                    similarities.remove(min(similarities, key=lambda x: x['similarity']))
                    val = all_artists[i]
                    val['similarity'] = similarity
                    similarities.append(val)
                    break
    return similarities







