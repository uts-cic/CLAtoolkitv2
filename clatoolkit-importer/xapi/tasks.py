from __future__ import absolute_import, unicode_literals
from .worker import app

from social_imports.utils.message_utils import decode_message

from social_imports import TrelloImporter, TwitterImporter, GithubImporter, SlackImporter

@app.task
def import_slack(encoded_data):
    msg = decode_message(encoded_data)
    importer = SlackImporter(msg)
    importer.perform_import()
    return True

@app.task
def import_github(encoded_data):
    msg = decode_message(encoded_data)
    importer = GithubImporter(msg)
    importer.perform_import()
    return True

@app.task
def import_twitter(encoded_data):
    msg = decode_message(encoded_data)
    importer = TwitterImporter(msg)
    importer.perform_import()
    return True

@app.task
def import_trello(encoded_data):
    msg = decode_message(encoded_data)
    importer = TrelloImporter(msg)
    importer.perform_import()
    return True

"""@app.task
def add(x, y):
    print("HELLO")
    return x + y


@app.task
def mul(x, y):
    return x * y


@app.task
def xsum(numbers):
    return sum(numbers)"""