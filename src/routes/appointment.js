import { Router } from 'express';
import User from '../models/User';
import Appointment from '../models/Appointment';
import stripe from '../stripe';

const router = Router();

router.get('/', (req, res) => {
  Promise.all([
    Appointment.find({ tutor: req.user._id }),
    Appointment.find({ learner: req.user._id }),
  ])
    .then(([asTutor, asLearner]) =>
      res.json({ asTutor, asLearner }))
    .catch(err =>
      res.status(400).json({ err, message: 'Could not fetch appointments.' }))
  ;
});

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

router.post('/approve/:id', (req, res) => {
  const tutor = req.user;

  if (!tutor.account) {
    res.status(400).json({ message: 'Tutor must have account registered.' });
    return;
  }

  Appointment.findOne({ _id: req.params.id, tutor: tutor._id, state: 'proposed' })
    .then(appointment => appointment.populate('learner').execPopulate())
    .then(appointment => appointment.learner.card
      ? appointment
      : Promise.reject('Learner must have a registred card.'))
    .then(async appointment => {
      const learner = appointment.learner;

      appointment.charge = (await stripe.charges.create({
        amount: tutor.wage * 100 * ((new Date(appointment.endDate) - new Date(appointment.startDate)) / 1000 / 60 / 60),
        currency: 'usd',
        customer: learner.card,
      }, {
        stripe_account: tutor.account,
      })).id;

      return appointment.save();
    })
    .then(appointment => {
      appointment.state = 'approved';
      return appointment.depopulate('learner').save();
    })
    .then(appointment => res.json({ appointment, message: 'Appointment approved.' }))
    .catch(err => res.status(400).json({ err, message: 'Appointment could not be approved.' }))
  ;
});


router.post('/reject/:id', (req, res) => {
  const tutor = req.user;

  Appointment.findOne({ _id: req.params.id, tutor: tutor._id, state: 'proposed' })
    .then(appointment => {
      appointment.state = 'rejected';
      return appointment.save();
    })
    .then(appointment => res.json({ appointment, message: 'Appointment rejected.' }))
    .catch(err => res.status(400).json({ err, message: 'Appointment could not be rejected.' }))
  ;
});

export default router;
