import * as Agenda from "agenda";

const agenda = new Agenda({db: { address: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
							collection: "scrapeJobs" }});

require('./scrapeJob')(agenda);

agenda.start();

export default agenda;