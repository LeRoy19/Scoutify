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


def recommend_by_artists(in_artists: list, accuracy: float, number: int = None) -> list:
    if number is None:
        number = 12

    db_artists = crawler.get_all_artists_as_dict()
    db_tags = crawler.get_all_tags()

    all_artists = db_artists['artists']
    number_of_artists = db_artists['count']
    all_tags = db_tags['tags']
    number_of_tags = db_tags['count']

    matrix = np.zeros((number_of_artists, number_of_tags), dtype=bool)
    for i in all_artists:
        for tag in all_artists[i]['tags']:
            matrix[all_artists[i]['row']][all_tags[tag]['column']] = 1

    in_rows = []
    for i in in_artists:
        if i in all_artists.keys():
            in_rows.append(matrix[all_artists[i]['row']])

    if not in_rows:
        return []

    input_tags = logic_or(in_rows)
    similarities = [{'similarity': -1} for i in range(number)]

    for i in all_artists:
        if i not in in_artists:
            similarity = cosine(input_tags, matrix[all_artists[i]['row']])

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
        number = 12
    db_artists = crawler.get_all_artists_as_dict()
    db_tags = crawler.get_all_tags()

    all_artists = db_artists['artists']
    number_of_artists = db_artists['count']
    all_tags = db_tags['tags']
    number_of_tags = db_tags['count']

    matrix = np.zeros((number_of_artists, number_of_tags), dtype=bool)
    for i in all_artists:
        for tag in all_artists[i]['tags']:
            matrix[all_artists[i]['row']][all_tags[tag]['column']] = 1

    similarities = [{'similarity': -1} for i in range(number)]
    input_tags = np.zeros(number_of_tags, dtype=bool)
    checked = False
    for tag in tags:
        if tag in all_tags.keys():
            input_tags[all_tags[tag]['column']] = 1
            checked = True

    if not checked:
        return []

    for i in all_artists:
        similarity = cosine(input_tags, matrix[all_artists[i]['row']])

        if similarity >= accuracy:
            for j in similarities:
                if j['similarity'] < similarity:
                    similarities.remove(min(similarities, key=lambda x: x['similarity']))
                    val = all_artists[i]
                    val['similarity'] = similarity
                    similarities.append(val)
                    break
    if max(similarities, key=lambda x: x['similarity']) == -1:
        similarities = []
    return similarities







