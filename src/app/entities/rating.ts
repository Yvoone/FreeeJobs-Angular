export class Rating {

    id: number;
    jobId: number;
    reviewerId: number;
    targetId: number;
    reviewTitle: string;
    review: string;
    ratingScale: number;

    constructor(id: number, jobId: number, reviewerId: number, targetId: number, reviewTitle: string, review: string, ratingScale: number) {
        this.id = id;
        this.jobId = jobId;
        this.reviewerId = reviewerId;
        this.targetId=targetId;
        this.reviewTitle = reviewTitle;
        this.review = review;
        this.ratingScale = ratingScale;
    }
}
