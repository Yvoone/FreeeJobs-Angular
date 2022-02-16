export class Rating {

    id: number;
    jobId: number;
    applicantId: number;
    reviewTitle: string;
    review: string;
    ratingScale: number;

    constructor(id: number, jobId: number, applicantId: number, reviewTitle: string, review: string, ratingScale: number) {
        this.id = id;
        this.jobId = jobId;
        this.applicantId = applicantId;
        this.reviewTitle = reviewTitle;
        this.review = review;
        this.ratingScale = ratingScale;
    }
}
