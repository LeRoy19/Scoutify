import json


class Artist:

    def __init__(self, id: str, name: str, genres: list, tags: str, related: list, image: str):
        super().__init__()
        self.name = name
        self.id = id
        self.genres = genres
        self.tags = tags
        self.related = related
        self.image = image

    def get_name(self) -> str:
        return self.name

    def set_name(self, name: str):
        self.name = name

    def get_id(self) -> str:
        return self.id

    def set_id(self, id: str):
        self.id = id

    def get_genres(self) -> list:
        return self.genres

    def set_genres(self, genres: list):
        self.genres = genres

    def get_tags(self) -> str:
        return self.tags

    def set_tags(self, tags: str):
        self.tags = tags

    def get_related(self) -> list:
        return self.related

    def set_related(self, related: list):
        self.related = related

    def get_image(self) -> str:
        return self.image

    def set_image(self, image: str):
        self.image = image

    def get_as_JSON(self) -> json:
        x = {
            "_id": self.id,
            "name": self.name,
            "genres": self.genres,
            "tags": self.tags,
            "related": self.related,
            "image": self.image
        }
        return json.dumps(x)

    def get_as_dict(self) -> dict:
        x = {
            "_id": self.id,
            "name": self.name,
            "genres": self.genres,
            "tags": self.tags,
            "related": self.related,
            "image": self.image
        }
        return x

    def __str__(self):
        return self.name
