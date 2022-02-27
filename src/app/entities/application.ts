import { JobListing } from "./job-listing";

export class Application {
    id: number;
    jobListing: JobListing;
    jobId: number;
    applicantId: number;
    description: string;
    status: string;

  constructor(id: number, jobListing: JobListing, jobId: number, applicantId: number, description: string,
              status: string) {
    this.id = id;
    this.jobListing = jobListing;
    this.jobId = jobId;
    this.applicantId = applicantId;
    this.description = description;
    this.status = status;
  }
}
