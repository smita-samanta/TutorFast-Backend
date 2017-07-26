import { Router } from 'express';
import User from '../models/User';
import Appointment from '../models/Appointment';


const router = Router();

router.post('/', (req, res) => {
  const learner = req.user;

  if (!learner.card) {
    res.status(400)
      .json({ message: 'Learner must have a registered card to create an appointment.' });
    return;
  }

  User.findOne({ _id: req.body.tutor, isTutor: true })
    .then(tutor => new Appointment({
      tutor: tutor._id,
      learner: learner._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
    }))
    .then(appointment => appointment.save())
    .then(appointment => res.json({ appointment, message: 'Appointment was created.' }))
    .catch(err => res.status(400).json({ err, message: 'Tutor does not exist.' }))
  ;
});

export default router;
