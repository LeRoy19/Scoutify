import networkx as nx
from .crawler import *


def create_graph(max_nodes: int, name: str, max_diameter: int = None) -> dict:
    global rel
    if max_diameter is None:
        max_diameter = 4
    g = nx.Graph()
    data = {'nodes': {},
            'links': []}
    start = api_get_id(name)
    to_link = [start]
    inserted = []
    global y
    while len(to_link) > 0 and len(inserted) <= max_nodes:
        actual = to_link.pop(0)
        art = get_artist_by_id(actual)
        if actual not in inserted:
            g.add_node(actual)
            inserted.append(actual)
            data['nodes'][actual] = {'name': art.get_name(), 'genres': art.get_genres(), 'image': art.get_image()}
        for y in art.get_related():
            if y not in inserted:
                rel = get_artist_by_id(y)
                g.add_node(actual)
                inserted.append(y)
                data['nodes'][y] = {'name': rel.get_name(), 'genres': rel.get_genres(), 'image': rel.get_image()}
                to_link.append(y)
            if not g.has_edge(y, actual):
                g.add_edge(actual, y)
                if max_shortest_path(start, g) > max_diameter:
                    g.remove_edge(actual, y)
                    return {'graph': g, 'data': data}
                data['links'].append({'source': actual, 'target': y})

    return {'graph': g, 'data': data}


def max_shortest_path(start: str, g: nx.Graph) -> int:
    max_path = 0
    for n in g.nodes:
        if n != start:
            path = nx.shortest_path_length(g, start, n)
            if path > max_path:
                max_path = path
    return max_path
