import { Router } from 'express';
import { 
  createDonation, 
  getDonations, 
  updateDonationStatus, 
  deleteDonation 
} from '../controllers/donationController';
const donationRouter = Router();

donationRouter.post('/createDonation', createDonation);         
donationRouter.get('/getDonations)', getDonations);         
donationRouter .patch('/updateDonationStatus/:id', updateDonationStatus); 
donationRouter.delete('/deleteDonation/:id', deleteDonation);

export default donationRouter;