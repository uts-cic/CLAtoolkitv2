require('dotenv').load();

const {graphql} = require('graphql');

const schema = require('../graph_models/github_schema');

const octokit = require('@octokit/graphql').defaults({
  headers: {
    authorization: `token ` + process.env.GITHUB_API
  }
})

async function query(query_string) {
	return await graphql(schema, query_string);
}

function create_query_commit(query_type, owner, repo) {
	num = 20;
	query = `query query_github($owner: String!, $repo: String!, $num: Int!) {
		repository(owner: $owner, name: $repo) {
			ref(qualifiedName:"refs/heads/master") {
				target {
					... on Commit {
						history(first: $num) {
							nodes {
								message
								author {
									name
									email
									user {
										login
									}
								}
							}
						}
					}
				}
			}
		}
	}`
	return query;
}

// "https://api.github.com/repos/chezecz/mygameslist/commits/d6d5cb4" 

async function github_query(query, owner, repo) {
	query = create_query_commit(query, owner, repo)
	const { data } = await octokit(query, {
		owner: owner,
		repo: repo,
		num: num
	})
	return data.repository
}

module.exports.query = async function(query) {
	return await github_query(query.type, query.owner, query.repo)
}