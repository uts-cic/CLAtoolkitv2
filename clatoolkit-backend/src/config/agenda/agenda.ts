import * as Agenda from "agenda";
import { scrapeJob } from "./scrapeJob";

/**
 * Agenda Job Processor setup
 * Used to process scraping schedules for
 * course data imports
 */
const agenda = new Agenda({db: { address: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
							collection: "scrapeJobs" }});

// Checks for jobs to run every 30 seconds
agenda.processEvery("30 seconds");

// Define data import job 
scrapeJob(agenda);

// Start processor
agenda.start();

export default agenda;