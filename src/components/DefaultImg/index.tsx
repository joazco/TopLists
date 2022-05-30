import { useEffect, useRef, useState } from "react";
import defaultImg from "./defaultImg.png";

const DefaultImg = (
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => {
  const { src, alt = "default img" } = props;
  const imgComponent = useRef<HTMLImageElement>(null);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (imgComponent && imgComponent.current) {
      const { current } = imgComponent;
      const downloadingImage: any = new Image();
      downloadingImage.onload = function () {
        current.src = this.src;
      };
      downloadingImage.src = src;
    }
  }, [src]);

  if (!src || showError) {
    return <img src={defaultImg} alt={alt} />;
  }
  return (
    <img
      {...props}
      alt={alt}
      ref={imgComponent}
      onError={() => setShowError(true)}
    />
  );
};

export default DefaultImg;
