import { Request, Response } from 'express';
import { RateOfferUseCase } from '../../../../application/use-cases/rating/RateOfferUseCase';
import { ListRatingsForUserUseCase } from '../../../../application/use-cases/rating/ListRatingsForUserUseCase';
import { OfferNotFoundError } from '../../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenRatingActionError } from '../../../../domain/errors/rating/ForbiddenRatingActionError';
import { InvalidRatingStateError } from '../../../../domain/errors/rating/InvalidRatingStateError';
import { InvalidRatingScoreError } from '../../../../domain/errors/rating/InvalidRatingScoreError';
import { RatingAlreadyExistsError } from '../../../../domain/errors/rating/RatingAlreadyExistsError';

export class RatingController {
  constructor(
    private readonly rateOfferUseCase: RateOfferUseCase,
    private readonly listRatingsForUserUseCase: ListRatingsForUserUseCase,
  ) {}

  create = async (req: Request<{ offerId: string }>, res: Response): Promise<void> => {
    const { offerId } = req.params;
    const { score, comment } = req.body;

    if (typeof score !== 'number') {
      res.status(400).json({ message: 'score is required' });
      return;
    }

    try {
      const rating = await this.rateOfferUseCase.execute({
        offerId,
        raterId: req.user!.id,
        score,
        comment,
      });
      res.status(201).json({ rating });
    } catch (error) {
      if (error instanceof OfferNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenRatingActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidRatingStateError || error instanceof RatingAlreadyExistsError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidRatingScoreError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  listForUser = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    const { userId } = req.params;
    const summary = await this.listRatingsForUserUseCase.execute(userId);
    res.status(200).json(summary);
  };
}
