import { Box, Center, Image, Input } from '@chakra-ui/react';
import dropImage from 'common/img/drop-image.svg';
import React, { ChangeEvent } from 'react';
import { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const getCroppedImage = (imgSrc: string) => {
  const image = document.createElement('img');
  image.src = imgSrc;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const pixelRatio = window.devicePixelRatio;
  // @ts-ignore: Unreachable code error
  canvas.width = image.naturalWidth * pixelRatio;
  // @ts-ignore: Unreachable code error
  canvas.height = ((image.naturalWidth * 9) / 16) * pixelRatio;

  if (ctx) {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, 607, 341);
    // @ts-ignore: Unreachable code error
    //canvas.toBlob((blob) => console.log(blob));
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob: any) => {
          blob.name = image.name;
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  }
};

interface ImageUploadsProps {
  getCroppedImage2?(image: File | null): void;
}

const cropSettings: Crop = {
  aspect: 16 / 9,
  width: 607,
  height: 341,
  unit: 'px',
};

export const ImageUploads = ({ getCroppedImage2 }: ImageUploadsProps) => {
  const [upImg, setUpImg] = React.useState<string | null>(null);
  const imgRef = React.useRef(null);
  const previewCanvasRef = React.useRef(null);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  React.useEffect(() => {
    console.log('Effect');
    if (upImg) {
      getCroppedImage(upImg);
    }
  }, [upImg]);
  console.log('geral upImg', upImg);
  return (
    <Box mt="4">
      <Box my="4">
        <Input type="file" accept="image/*" onChange={onSelectFile} />
      </Box>
      {upImg ? (
        <Image ref={imgRef} src={upImg} width={607} />
      ) : (
        <Center width={607} height={341} borderWidth="1px" bgColor="gray.50" borderRadius="lg">
          <Image src={dropImage} />
        </Center>
      )}
      <Box mt="4">
        <canvas ref={previewCanvasRef} />
      </Box>
    </Box>
  );
};

/*
{upImg && (
        <>
          {/*<ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(crop: Crop) => setCrop(crop)}
            onComplete={(crop: Crop) => setCompletedCrop(crop)}
            minWidth={460}
            maxWidth={607}
            //locked={true}
            style={previewDim}
            imageStyle={{ width: '100%', height: '100%' }}
          />}
          <Image ref={imgRef} src={upImg} width={607} height={341} />
          <Box>
            <canvas
              ref={previewCanvasRef}
              // Rounding is important so the canvas width and height matches/is
              // a multiple for sharpness.
              //style={{
              //  width: Math.round(completedCrop?.width ?? 0),
              //  height: Math.round(completedCrop?.height ?? 0),
              //}}
              style={{
                width: 1280,
                height: 720,
              }}
            />
          </Box>
        </>
      )}*/
