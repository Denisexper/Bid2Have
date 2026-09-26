import { Request, Response } from 'express';
import { CreateListingUseCase } from '../../../../application/use-cases/listing/CreateListingUseCase';
import { ListListingsUseCase } from '../../../../application/use-cases/listing/ListListingsUseCase';
import { SearchListingsNearbyUseCase } from '../../../../application/use-cases/listing/SearchListingsNearbyUseCase';
import { GetListingByIdUseCase } from '../../../../application/use-cases/listing/GetListingByIdUseCase';
import { UpdateListingUseCase } from '../../../../application/use-cases/listing/UpdateListingUseCase';
import { DeleteListingUseCase } from '../../../../application/use-cases/listing/DeleteListingUseCase';
import { ListingNotFoundError } from '../../../../domain/errors/listing/ListingNotFoundError';
import { ForbiddenListingActionError } from '../../../../domain/errors/listing/ForbiddenListingActionError';
import { CategoryNotFoundError } from '../../../../domain/errors/category/CategoryNotFoundError';
import { SaleMode } from '../../../../generated/prisma/enums';

export class ListingController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly listListingsUseCase: ListListingsUseCase,
    private readonly searchListingsNearbyUseCase: SearchListingsNearbyUseCase,
    private readonly getListingByIdUseCase: GetListingByIdUseCase,
    private readonly updateListingUseCase: UpdateListingUseCase,
    private readonly deleteListingUseCase: DeleteListingUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { title, description, categoryId, condition, price, currency, photos, lat, lng, saleMode, auctionEndAt } =
      req.body;

    if (
      !title ||
      typeof title !== 'string' ||
      !description ||
      typeof description !== 'string' ||
      !categoryId ||
      typeof categoryId !== 'string' ||
      !condition ||
      typeof price !== 'number' ||
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      !saleMode
    ) {
      res.status(400).json({ message: 'title, description, categoryId, condition, price, lat, lng and saleMode are required' });
      return;
    }

    if (saleMode === SaleMode.AUCTION && !auctionEndAt) {
      res.status(400).json({ message: 'auctionEndAt is required when saleMode is AUCTION' });
      return;
    }

    try {
      const listing = await this.createListingUseCase.execute({
        sellerId: req.user!.id,
        title,
        description,
        categoryId,
        condition,
        price,
        currency,
        photos: Array.isArray(photos) ? photos : [],
        lat,
        lng,
        saleMode,
        auctionEndAt: auctionEndAt ? new Date(auctionEndAt) : null,
      });
      res.status(201).json({ listing });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { lat, lng, radiusKm } = req.query;

    if (lat === undefined && lng === undefined) {
      const listings = await this.listListingsUseCase.execute();
      res.status(200).json({ listings });
      return;
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      res.status(400).json({ message: 'lat and lng must both be valid numbers' });
      return;
    }

    let parsedRadiusKm: number | undefined;
    if (radiusKm !== undefined) {
      parsedRadiusKm = Number(radiusKm);
      if (Number.isNaN(parsedRadiusKm)) {
        res.status(400).json({ message: 'radiusKm must be a valid number' });
        return;
      }
    }

    const listings = await this.searchListingsNearbyUseCase.execute({
      lat: parsedLat,
      lng: parsedLng,
      radiusKm: parsedRadiusKm,
    });
    res.status(200).json({ listings });
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const listing = await this.getListingByIdUseCase.execute(id);
      res.status(200).json({ listing });
    } catch (error) {
      if (error instanceof ListingNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description, categoryId, condition, price, currency, photos, lat, lng, saleMode, auctionEndAt, status } =
      req.body;

    try {
      const listing = await this.updateListingUseCase.execute(
        id,
        {
          title,
          description,
          categoryId,
          condition,
          price,
          currency,
          photos,
          lat,
          lng,
          saleMode,
          auctionEndAt: auctionEndAt ? new Date(auctionEndAt) : undefined,
          status,
        },
        req.user!,
      );
      res.status(200).json({ listing });
    } catch (error) {
      if (error instanceof ListingNotFoundError || error instanceof CategoryNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenListingActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await this.deleteListingUseCase.execute(id, req.user!);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ListingNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenListingActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}
