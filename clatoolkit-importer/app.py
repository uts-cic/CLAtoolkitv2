from flask import flask

from social_imports import TrelloImporter, TwitterImporter, GithubImporter, SlackImporter

app = Flask(__name__)


import_map_dict = {
	'trello': TrelloImporter,
	'twitter': TwitterImporter,
	'github': GithubImporter,
	'slack': SlackImporter
}

@app.route("/dataimport", methods = ['POST'])
def data_import:
	content = request.get_json(force=True)
	importer = import_map_dict[content.platform](content)
	importer.perform_import()

if __name__ == "__main__":
	app.run(debug=True)
