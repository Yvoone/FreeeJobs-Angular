export class Rating {

    id: number;
    jobId: number;
    userId: number;
    reviewTitle: string;
    review: string;
    ratingScale: number;

    constructor(id: number, jobId: number, userId: number, reviewTitle: string, review: string, ratingScale: number) {
        this.id = id;
        this.jobId = jobId;
        this.userId = userId;
        this.reviewTitle = reviewTitle;
        this.review = review;
        this.ratingScale = ratingScale;
    }
}
