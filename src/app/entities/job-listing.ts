export class JobListing {
  id: number;
  authorId: number;
  title: string;
  details: string;
  rate: string;
  rateType: string;
  status: string;

  constructor(id: number, authorId: number, title: string, details: string, rate: string, rateType: string,
              status: string) {
    this.id = id;
    this.authorId = authorId;
    this.title = title;
    this.details = details;
    this.rate = rate;
    this.rateType = rateType;
    this.status = status;
  }
}

