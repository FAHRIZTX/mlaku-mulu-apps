import { UUID } from "crypto";

export type TripRequestDto = {
    tanggalMulaiPerjalanan: Date;
    tanggalBerakhirPerjalanan: Date;
    destinasiPerjalanan: string;
    touristId: UUID;
  };
  