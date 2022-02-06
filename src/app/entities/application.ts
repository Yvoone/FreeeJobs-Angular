import { JobListing } from "./job-listing";

export class Application {
    id: number;
    jobListing: JobListing;
    applicantId: number;
    description: string;
    status: string;

  constructor(id: number, jobListing: JobListing, applicantId: number, description: string,
              status: string) {
    this.id = id;
    this.jobListing = jobListing;
    this.applicantId = applicantId;
    this.description = description;
    this.status = status;
  }
}
