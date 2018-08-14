from flask import flask

from social_imports import TrelloImporter, TwitterImporter, GithubImporter, SlackImporter

app = Flask(__name__)

@app.route("/trello", methods = ['POST'])
def import_trello:
	content = request.get_json(force=True)
	importer = TrelloImporter(content)
	importer.perform_import()



if __name__ == "__main__":
	app.run(debug=True)
