from flask import Flask, request
import os

from social_imports import TrelloImporter, TwitterImporter, GithubImporter, SlackImporter

app = Flask(__name__)


import_map_dict = {
	'trello': TrelloImporter,
	'twitter': TwitterImporter,
	'github': GithubImporter,
	'slack': SlackImporter
}

@app.route("/dataimport", methods = ['POST'])
def data_import():
	print request.data
	content = request.get_json(force=True)
	
	for platformToken in content['platformTokens']: 
		importer = import_map_dict[content['platform']](content, platformToken)
		importer.perform_import()

	return ""
	#importer = import_map_dict[content.platform](content)
	#importer.perform_import()


# We need a db (probably temporarily) to
# ensure we're not doubling up on xAPI statements
# being sent
def initDb():
	import sqlite3
	db = os.getcwd() + "/previousimports.db"
	print "DB: %s" % db
	with sqlite3.connect(db) as conn:
		c = conn.cursor()

		c.execute("CREATE TABLE IF NOT EXISTS imports (hash varchar(256));")
		c.execute("CREATE UNIQUE INDEX IF NOT EXISTS stmt_idx ON imports(hash)")

		conn.commit()

if __name__ == "__main__":
	initDb()

	app.run(debug=True)
