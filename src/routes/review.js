import { Router } from 'express';
import User from '../models/User';
import Review from '../models/Review';

const router = Router();

router.get('/', (req, res) => { 
  Promise.all([
    Review.find({ tutor: req.user._id }),
    Review.find({ learner: req.user._id }),
  ])
    .then(([reviewTutor, reviewLearner]) =>
      res.json({ reviewTutor, reviewLearner }))
    .catch(err => res.status(400).json({ err, message: 'Could not find reviews.' }));
});

router.post('/', (req, res) => {
	const learner = req.user;
	User.findOne({ _id: req.body.tutor, isTutor: true })
    .then(tutor => new Review({
      	tutor: tutor._id,
      	learner: learner._id,
		$push: {userRating: {
                        reviewedName: req.body.sender,
                    	reviewerFullname: learner.fullname,
                        userRating: req.body.clickedValue,
                        userReview: req.body.review
                    }, 
                        ratingNumber: req.body.clickedValue       
                },
                $inc: {ratingSum: req.body.clickedValue}
                },
    }))
    .then(review => review.save())
    .then(review => res.json({ review, message: 'Your review has been added.' }))
    .catch(err => res.status(400).json({ err, message: 'Tutor does not exist.' }))
  ;
});


export default router;



