import { Request, Response } from 'express';
import { CreateOfferUseCase } from '../../../../application/use-cases/offer/CreateOfferUseCase';
import { ListOffersForListingUseCase } from '../../../../application/use-cases/offer/ListOffersForListingUseCase';
import { GetOfferByIdUseCase } from '../../../../application/use-cases/offer/GetOfferByIdUseCase';
import { AcceptOfferUseCase } from '../../../../application/use-cases/offer/AcceptOfferUseCase';
import { RejectOfferUseCase } from '../../../../application/use-cases/offer/RejectOfferUseCase';
import { CounterOfferUseCase } from '../../../../application/use-cases/offer/CounterOfferUseCase';
import { OfferNotFoundError } from '../../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenOfferActionError } from '../../../../domain/errors/offer/ForbiddenOfferActionError';
import { CannotOfferOnOwnListingError } from '../../../../domain/errors/offer/CannotOfferOnOwnListingError';
import { ListingNotAvailableError } from '../../../../domain/errors/offer/ListingNotAvailableError';
import { InvalidOfferAmountError } from '../../../../domain/errors/offer/InvalidOfferAmountError';
import { InvalidOfferStateError } from '../../../../domain/errors/offer/InvalidOfferStateError';
import { ListingNotFoundError } from '../../../../domain/errors/listing/ListingNotFoundError';

export class OfferController {
  constructor(
    private readonly createOfferUseCase: CreateOfferUseCase,
    private readonly listOffersForListingUseCase: ListOffersForListingUseCase,
    private readonly getOfferByIdUseCase: GetOfferByIdUseCase,
    private readonly acceptOfferUseCase: AcceptOfferUseCase,
    private readonly rejectOfferUseCase: RejectOfferUseCase,
    private readonly counterOfferUseCase: CounterOfferUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { listingId, amount } = req.body;

    if (!listingId || typeof listingId !== 'string' || typeof amount !== 'number') {
      res.status(400).json({ message: 'listingId and amount are required' });
      return;
    }

    try {
      const offer = await this.createOfferUseCase.execute({ listingId, buyerId: req.user!.id, amount });
      res.status(201).json({ offer });
    } catch (error) {
      if (error instanceof ListingNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CannotOfferOnOwnListingError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof ListingNotAvailableError || error instanceof InvalidOfferAmountError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  listForListing = async (req: Request<{ listingId: string }>, res: Response): Promise<void> => {
    const { listingId } = req.params;

    try {
      const offers = await this.listOffersForListingUseCase.execute(listingId, req.user!);
      res.status(200).json({ offers });
    } catch (error) {
      if (error instanceof ListingNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenOfferActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const offer = await this.getOfferByIdUseCase.execute(id, req.user!);
      res.status(200).json({ offer });
    } catch (error) {
      if (error instanceof OfferNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenOfferActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  accept = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const offer = await this.acceptOfferUseCase.execute(id, req.user!);
      res.status(200).json({ offer });
    } catch (error) {
      if (error instanceof OfferNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenOfferActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidOfferStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  reject = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const offer = await this.rejectOfferUseCase.execute(id, req.user!);
      res.status(200).json({ offer });
    } catch (error) {
      if (error instanceof OfferNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenOfferActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidOfferStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  counter = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number') {
      res.status(400).json({ message: 'amount is required' });
      return;
    }

    try {
      const offer = await this.counterOfferUseCase.execute(id, amount, req.user!);
      res.status(201).json({ offer });
    } catch (error) {
      if (error instanceof OfferNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenOfferActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidOfferStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidOfferAmountError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}
