import { Region } from "./region";

export type Image = {
  id: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  angle: number;
  regions: Region[];
};

export type UploadedImage = {
  id: string;
  alt: string;
  src: string;
};

export type ImageMargin = {
  width: number;
  height: number;
};
