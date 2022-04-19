const Image = (props) => {
  return (
    <img
    id={123}
      ref={props.imgRef}
      src="https://jw-webmagazine.com/wp-content/uploads/2020/03/Kimetsu-no-YaibaDemon-Slayer.jpg"
      alt="new"
      onLoad={props.onImgLoad}
    />
  );
};

export default Image;
